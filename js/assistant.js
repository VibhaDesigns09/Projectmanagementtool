/* Rare·Desk disease assistant: a chat panel on every disease page, grounded on the open profile.
   In Claude (published page): answers through the viewer's own Claude access (`sample` capability) and can look up
   other directory diseases. Self-hosted copy: optional web research with the viewer's own Anthropic API key. */
(function () {
  "use strict";
  const RD = window.RD;
  if (!RD) return;
  const { ic, esc } = RD;
  const $ = s => document.querySelector(s);
  const fab = $("#chatFab"), fabLabel = $("#chatFabLabel"), box = $("#chat"), log = $("#chatLog"), form = $("#chatForm"),
    input = $("#chatInput"), sendBtn = $("#chatSend"), stopBtn = $("#chatStop"), clearBtn = $("#chatClear"), closeBtn = $("#chatClose"),
    titleEl = $("#chatTitle"), modeEl = $("#chatMode"), attachEl = $("#chatAttach"), forgetBtn = $("#chatForget"), tierEl = $("#chatTier");

  const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm";
  const MODEL = "claude-opus-5-5";
  const KEY_SLOT = "rd.anthropicKey";
  const KEEP = 12;                       // most recent turns sent back with each question
  const HIDE = ["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"];

  let P = RD.current;
  let mode = "detecting";                // viewer · api · off · detecting
  let sample = null, toolsOK = false, tier = "fast";
  let ctl = null, busyKey = null, attach = null, offReason = "";
  const threads = new Map();
  const thread = () => { if (!threads.has(P.key)) threads.set(P.key, []); return threads.get(P.key); };

  /* API key lives only in this tab (sessionStorage), never in localStorage */
  let memKey = "";
  const keyStore = {
    get() { try { return sessionStorage.getItem(KEY_SLOT) || memKey; } catch (_) { return memKey; } },
    set(v) { memKey = v; try { sessionStorage.setItem(KEY_SLOT, v); } catch (_) { /* memory only */ } },
    clear() { memKey = ""; try { sessionStorage.removeItem(KEY_SLOT); } catch (_) { /* ignore */ } },
  };

  /* ---------- which engine answers ---------- */
  const ready = (async () => {
    const c = window.claude;
    if (c && typeof c.use === "function") {
      try { sample = await c.use("sample"); } catch (_) { sample = null; }
      if (typeof sample === "function") {
        mode = "viewer";
        try { const lim = await sample.limits(); toolsOK = !!(lim && lim.tools); } catch (_) { toolsOK = false; }
      } else { mode = "off"; offReason = "The assistant isn't available in this view. Open the page in Claude to use it."; }
    } else mode = "api";
    paintMode();
    if (!box.hidden) paint();
  })();

  function paintMode() {
    const txt = { detecting: "Connecting…", viewer: "Answers from this page · your Claude access", off: "Not available in this view",
      api: keyStore.get() ? "Web research on · your API key" : "Add an API key to turn on" }[mode];
    modeEl.textContent = txt;
    forgetBtn.hidden = !(mode === "api" && keyStore.get());
  }

  /* ---------- prompts ---------- */
  function rules(prof, web) {
    return [
      `You are the research assistant in Rare·Desk, a US desk-research tool for rare diseases. The user is a healthcare market researcher looking at the ${prof.name} profile. Its data is below under PAGE DATA.`,
      "",
      "How to answer:",
      "- Use the PAGE DATA first. Add well-established medical or US health-system knowledge when it helps, and mark it (general knowledge).",
      "- Keep everything US-specific: FDA, CMS (Medicare, Medicaid), commercial payers and PBMs, US specialist titles, US patient organizations.",
      "- Make it quick to scan: a one-line answer, then at most 6 short bullets with **bold** key terms. No tables unless asked. Stay under 200 words unless asked for more.",
      web
        ? "- Search the web for anything recent or missing from the page. Prefer FDA, CMS, ClinicalTrials.gov, PubMed, NIH and US patient organizations, and cite the pages you used."
        : "- You can't browse the web. Cite page sources by name and URL when you use them. Never invent URLs, trial names, numbers or dates; if unsure, say so and say where to check (FDA, ClinicalTrials.gov, PubMed, CMS).",
      "- The page data was reviewed in October 2026. Approval status, coverage and prices change, so say when something should be verified.",
      "- For screener or discussion-guide requests, follow US healthcare market-research norms (Insights Association, Intellus Worldwide): termination logic, quotas, industry exclusion, past-3-month participation, VT/MN/MA compliance flags and adverse-event reporting.",
      !web && toolsOK ? "- To compare with or look up another disease, call search_directory, then get_disease_profile." : null,
      "- This supports research, not patient care. Don't give personal medical advice.",
      "",
      "PAGE DATA",
      RD.profileText(prof),
    ].filter(x => x !== null).join("\n");
  }
  function history(hist) {
    const out = [];
    for (const t of hist) {
      const content = t.role === "user" ? t.content : t.text;
      if (!content || !content.trim()) continue;
      const last = out[out.length - 1];
      if (last && last.role === t.role) last.content += "\n\n" + content; else out.push({ role: t.role, content });
    }
    const s = out.slice(-KEEP);
    while (s.length && s[0].role !== "user") s.shift();
    return s;
  }
  function suggestions(prof) {
    const L = r => (r[3].match(/L/g) || []).length;
    const lead = prof.stakeholders.filter(r => r[0] === "care" || r[0] === "dx").sort((a, b) => L(b) - L(a))[0];
    const out = [`Summarize ${prof.name} in 5 bullets for a newcomer`,
      "Who influences access to treatment in the US, and how?",
      "What are the biggest gaps, and who is working on them?",
      `What should I ask a ${lead ? lead[1] : "specialist"} in a 60-minute interview?`];
    out.push(prof.approved.length ? `How do US payers manage ${prof.approved[0][0].replace(/ \(.*\)$/, "")}?` : "What is the most advanced therapy in development?");
    if (toolsOK || mode === "api") out.push(`Compare ${prof.name} with a similar rare disease`);
    return out;
  }

  /* ---------- engines ---------- */
  async function viaViewer(prof, hist, onText, signal, bot) {
    const opts = { signal, cache: false, modelTier: tier === "deep" ? "default" : "quick", onText: ({ text }) => onText(text) };
    if (toolsOK) opts.tools = pageTools(bot);
    const r = await sample([{ role: "user", content: rules(prof, false) }, ...history(hist)], opts);
    return { text: r.text, truncated: r.truncated };
  }
  function pageTools(bot) {
    const say = s => phase(bot, s);
    return [
      { name: "search_directory", description: "Search Rare·Desk's US directory of 170+ rare diseases by name, synonym or keyword. Returns up to 8 matches as {name, category}.",
        inputSchema: { type: "object", properties: { query: { type: "string", description: "Disease name or keyword" } }, required: ["query"] },
        execute: inp => { const q = String(inp.query || "").slice(0, 80); say(`Searching the directory for “${q}”…`); return RD.find(q); } },
      { name: "get_disease_profile", description: "Get the full Rare·Desk US profile of one directory disease: journey, stakeholders, US access, pipeline, gaps and sources. Use an exact name from search_directory.",
        inputSchema: { type: "object", properties: { name: { type: "string", description: "Exact disease name" } }, required: ["name"] },
        execute: inp => {
          const n = String(inp.name || "").slice(0, 120);
          say(`Reading the ${n} profile…`);
          const t = RD.profileTextOf(n);
          if (!t) throw new Error(`"${n}" isn't in the directory. Try search_directory first.`);
          return t.slice(0, 24000);
        } },
    ];
  }

  let sdkP = null;
  async function viaApi(prof, hist, onText, signal, bot) {
    let Anthropic;
    try { sdkP = sdkP || import(SDK_URL); const m = await sdkP; Anthropic = m.default || m.Anthropic; }
    catch (_) { sdkP = null; throw { code: "sdk" }; }
    const client = new Anthropic({ apiKey: keyStore.get(), dangerouslyAllowBrowser: true });
    let messages = history(hist), text = "", lastType = "";
    const src = new Map();
    try {
      for (let round = 0; round < 4; round++) {
        const stream = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 8000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: tier === "deep" ? "high" : "low" },
          system: rules(prof, true),
          messages,
          tools: [
            { type: "web_search_20260209", name: "web_search", max_uses: 5, user_location: { type: "approximate", country: "US" } },
            { type: "web_fetch_20260209", name: "web_fetch", max_uses: 4 },
          ],
        }, { signal });
        stream.on("streamEvent", ev => {
          if (ev.type !== "content_block_start") return;
          const t = ev.content_block.type;
          if (t === "server_tool_use") phase(bot, ev.content_block.name === "web_fetch" ? "Reading a source…" : "Searching the web…");
          if (t === "text" && text && /tool/.test(lastType) && !/\n\n$/.test(text)) text += "\n\n";
          lastType = t;
        });
        stream.on("text", d => { text += d; onText(text); });
        const msg = await stream.finalMessage();
        collectSources(msg, src);
        if (msg.stop_reason === "refusal") throw { code: "refused" };
        if (msg.stop_reason === "pause_turn") { messages = [...messages, { role: "assistant", content: msg.content }]; continue; }
        return { text, truncated: msg.stop_reason === "max_tokens", sources: [...src.values()].slice(0, 8) };
      }
      return { text, truncated: true, sources: [...src.values()].slice(0, 8) };
    } catch (e) {
      if (e && typeof e.code === "string" && !("status" in e)) throw Object.assign(e, { text: e.code === "refused" ? undefined : text });
      if (signal.aborted || (e && e.name === "APIUserAbortError")) throw { code: "cancelled", text };
      const st = e && e.status;
      throw { code: st === 401 || st === 403 ? "auth" : st === 429 || st === 529 ? "rate_limited" : st === 400 ? "invalid_request" : st ? "upstream_error" : "network", message: e && e.message, text };
    }
  }
  function collectSources(msg, src) {
    for (const b of msg.content || []) {
      if (b.type === "text" && Array.isArray(b.citations)) {
        for (const c of b.citations) if (c.url && !src.has(c.url)) src.set(c.url, { url: c.url, title: c.title || "" });
      } else if (b.type === "web_fetch_tool_result" && b.content && b.content.type === "web_fetch_result" && b.content.url && !src.has(b.content.url)) {
        src.set(b.content.url, { url: b.content.url, title: (b.content.content && b.content.content.title) || "" });
      }
    }
  }

  /* ---------- safe markdown (escape first, then a small subset) ---------- */
  function inline(s) {
    let h = esc(s);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
    h = h.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, (m, p, u) => `${p}<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\/(www\.)?/, "").replace(/&amp;/g, "&").slice(0, 46)}</a>`);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
    return h;
  }
  function md(src) {
    let html = "", list = null, para = [];
    const flush = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>`; para = []; } };
    const endList = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of String(src).replace(/\r/g, "").split("\n")) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flush(); endList(); continue; }
      if (/^\s*(---+|\*\*\*+)\s*$/.test(line) || /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line)) { flush(); endList(); continue; }
      if ((m = line.match(/^\s*#{1,6}\s+(.*)$/))) { flush(); endList(); html += `<h4>${inline(m[1])}</h4>`; continue; }
      if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) { flush(); if (list !== "ul") { endList(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; continue; }
      if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) { flush(); if (list !== "ol") { endList(); html += "<ol>"; list = "ol"; } html += `<li>${inline(m[1])}</li>`; continue; }
      if (/^\s*\|.*\|\s*$/.test(line)) { flush(); endList(); html += `<p>${inline(line.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim()).join(" · "))}</p>`; continue; }
      endList(); para.push(line.trim());
    }
    flush(); endList();
    return html;
  }

  /* ---------- rendering ---------- */
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (_) { return u; } };
  function phase(bot, s) {
    bot.phase = s;
    if (!bot.text && bot.el && document.contains(bot.el)) bot.el.innerHTML = `<div class="status">${esc(s)}</div>`;
  }
  function msgHtml(t, i) {
    if (t.role === "user") return `<div class="msg user">${esc(t.shown)}${t.att ? `<span class="att">${ic("clipboard")}${esc(t.att)}</span>` : ""}</div>`;
    const body = t.text ? md(t.text) : t.pending ? `<div class="status">${esc(t.phase || "Thinking…")}</div>` : "";
    const src = t.sources && t.sources.length ? `<div class="srcs"><b>Sources</b><ol>${t.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || host(s.url))}</a></li>`).join("")}</ol></div>` : "";
    const notes = (t.notes || []).map(n => `<div class="mnote">${ic("alert")}${esc(n)}</div>`).join("");
    if (!body && !src && !notes) return "";
    return `<div class="msg bot" data-i="${i}"><div class="body">${body}</div>${src}${notes}</div>`;
  }
  function keyboxHtml() {
    return `<div class="keybox">
      <b style="color:var(--ink)">${ic("globe")} Turn on web research</b>
      <span>This copy runs outside Claude. Add your Anthropic API key so the assistant can search the web and read the linked articles. The key stays in this browser tab and is cleared when you close it. Use it only on a device you trust.</span>
      <form class="row" id="keyForm"><input type="password" id="apiKey" placeholder="sk-ant-…" autocomplete="off" spellcheck="false" aria-label="Anthropic API key" style="flex:1"><button class="btn primary" type="submit">Connect</button></form>
      <a href="https://platform.claude.com" target="_blank" rel="noopener">Get an API key on the Claude Developer Platform</a>
    </div>`;
  }
  const nearBottom = () => log.scrollHeight - log.scrollTop - log.clientHeight < 80;
  function paint() {
    if (!P) return;
    titleEl.textContent = "Ask about " + P.name;
    const T = thread();
    let h = "";
    if (!T.length) {
      h += `<div class="msg bot"><p>Ask anything about <b>${esc(P.name)}</b>: the patient journey, stakeholders, US access, pipeline or gaps.</p>
        <p>${mode === "api" ? "I search the web and read sources, then cite them." : `I answer from this page's research and cite its sources${toolsOK ? ", and can compare with other diseases in the directory" : ""}.`}</p></div>`;
      if (mode !== "off") h += `<div class="sugg">${suggestions(P).map(s => `<button type="button" data-ask="${esc(s)}">${esc(s)}</button>`).join("")}</div>`;
    }
    T.forEach((t, i) => { h += msgHtml(t, i); });
    if (mode === "api" && !keyStore.get()) h += keyboxHtml();
    if (mode === "off") h += `<div class="msg note">${esc(offReason)}</div>`;
    if (mode === "detecting") h += `<div class="status">Connecting…</div>`;
    log.innerHTML = h;
    T.forEach((t, i) => { if (t.role === "assistant") t.el = log.querySelector(`[data-i="${i}"] .body`); });
    controls();
    log.scrollTop = log.scrollHeight;
  }
  function controls() {
    const busy = !!busyKey;
    sendBtn.hidden = busy; stopBtn.hidden = !busy;
    const blocked = mode === "off" || (mode === "api" && !keyStore.get());
    input.disabled = blocked; sendBtn.disabled = blocked;
    clearBtn.disabled = !P || !thread().length;
    attachEl.hidden = !attach;
    if (attach) attachEl.innerHTML = `${ic("clipboard")}<span>${esc(attach.label)}</span><button type="button" class="x" aria-label="Remove attachment">${ic("close")}</button>`;
    tierEl.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tier === tier)));
    paintMode();
  }
  function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; }

  /* ---------- ask ---------- */
  async function ask(q) {
    q = String(q || "").trim();
    if (!q || !P || busyKey) return;
    if (mode === "detecting") await ready;
    if (mode === "off") { paint(); return; }
    if (mode === "api" && !keyStore.get()) { paint(); log.querySelector("#apiKey")?.focus(); return; }
    const prof = P, key = P.key, T = thread();
    T.push({ role: "user", shown: q, content: attach ? `${q}\n\n${attach.label}:\n${attach.text}` : q, att: attach ? attach.label : "" });
    attach = null;
    const bot = { role: "assistant", text: "", pending: true, notes: [], sources: [] };
    T.push(bot);
    input.value = ""; autosize();
    const my = ctl = new AbortController();
    busyKey = key;
    paint();
    if (!box.contains(document.activeElement) || document.activeElement === sendBtn) input.focus();
    const onText = text => {
      bot.text = text;
      if (bot.el && document.contains(bot.el)) { const stick = nearBottom(); bot.el.innerHTML = md(text); if (stick) log.scrollTop = log.scrollHeight; }
    };
    try {
      const hist = T.slice(0, -1);
      const r = mode === "viewer" ? await viaViewer(prof, hist, onText, my.signal, bot) : await viaApi(prof, hist, onText, my.signal, bot);
      bot.text = r.text;
      bot.sources = r.sources || [];
      if (r.truncated) bot.notes.push("The answer was cut short. Ask for less at a time.");
    } catch (e) {
      fail(e || {}, bot);
    } finally {
      bot.pending = false; busyKey = null;
      if (ctl === my) ctl = null;
      if (P && P.key === key && !box.hidden) paint(); else controls();
    }
  }
  function fail(e, bot) {
    const code = typeof e.code === "string" ? e.code : "upstream_error";
    if (code === "refused") { bot.text = ""; bot.notes.push("Claude couldn't answer that one. Try rephrasing the question."); return; }
    if (typeof e.text === "string" && e.text) bot.text = e.text;
    if (code === "cancelled") { bot.notes.push("Stopped."); return; }
    if (HIDE.includes(code)) {
      mode = "off";
      offReason = "Claude access isn't allowed for this page, so the assistant is off. Everything else on the page still works.";
      return;
    }
    if (code === "tools_unavailable") toolsOK = false;
    if (code === "auth") keyStore.clear();
    bot.notes.push({
      rate_limited: "Too many questions at once, or your usage limit was reached. Try again in a minute.",
      session_expired: "Your Claude session expired. Sign in again, then retry.",
      empty_completion: "No answer came back. Try a simpler question.",
      prompt_too_large: "This conversation got too long. Clear it and ask again.",
      tools_unavailable: "Directory lookups aren't available here. Ask again.",
      auth: "That API key was rejected. Check it and connect again.",
      sdk: "Couldn't load the Anthropic SDK. This copy needs internet access to cdn.jsdelivr.net.",
      network: "Couldn't reach the Claude API. Check your connection and try again.",
      invalid_request: "The request was rejected" + (e.message ? ": " + String(e.message).slice(0, 160) : "."),
    }[code] || "The answer was interrupted. Try again.");
  }

  /* ---------- open / close ---------- */
  function open(detail) {
    if (!P) return;
    box.hidden = false; fab.hidden = true;
    if (detail && detail.context) attach = detail.context;
    if (detail && detail.prompt) { input.value = detail.prompt; }
    paint(); autosize();
    if (!input.disabled) input.focus(); else (log.querySelector("#apiKey") || closeBtn).focus();
  }
  function close() {
    box.hidden = true;
    fab.hidden = !P;
    if (P) fab.focus();
  }

  /* ---------- events ---------- */
  fab.addEventListener("click", () => open());
  closeBtn.addEventListener("click", close);
  stopBtn.addEventListener("click", () => ctl && ctl.abort());
  clearBtn.addEventListener("click", () => {
    if (!P) return;
    if (busyKey === P.key && ctl) ctl.abort();
    threads.set(P.key, []); attach = null; paint(); input.focus();
  });
  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); });
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); } });
  input.addEventListener("input", autosize);
  box.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } });
  log.addEventListener("click", e => { const b = e.target.closest("[data-ask]"); if (b) ask(b.dataset.ask); });
  log.addEventListener("submit", e => {
    if (e.target.id !== "keyForm") return;
    e.preventDefault();
    const v = log.querySelector("#apiKey").value.trim();
    if (!/^sk-ant-/.test(v)) { RD.toast("That doesn't look like an Anthropic API key"); return; }
    keyStore.set(v); paint(); input.focus();
  });
  forgetBtn.addEventListener("click", () => { keyStore.clear(); paint(); });
  attachEl.addEventListener("click", e => { if (e.target.closest(".x")) { attach = null; controls(); input.focus(); } });
  tierEl.addEventListener("click", e => { const b = e.target.closest("[data-tier]"); if (b) { tier = b.dataset.tier; controls(); } });

  document.addEventListener("rd:chat-open", e => open(e.detail));
  document.addEventListener("rd:profile", e => {
    const next = e.detail;
    if (busyKey && ctl && (!next || next.key !== busyKey)) ctl.abort();
    if (!next || !P || next.key !== P.key) attach = null;
    P = next;
    if (!P) { box.hidden = true; fab.hidden = true; return; }
    fabLabel.textContent = "Ask about " + (P.name.length > 28 ? P.name.slice(0, 26) + "…" : P.name);
    fab.setAttribute("aria-label", "Ask about " + P.name);
    if (box.hidden) fab.hidden = false; else paint();
  });

  if (P) { fabLabel.textContent = "Ask about " + (P.name.length > 28 ? P.name.slice(0, 26) + "…" : P.name); fab.setAttribute("aria-label", "Ask about " + P.name); fab.hidden = false; }
  controls();
})();
