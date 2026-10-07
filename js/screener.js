/* Rare·Desk screener builder: drafts a US recruitment screener for any stakeholder,
   pre-filled from the open disease profile (journey map, specialists, therapies, US access, US estimate). */
(function () {
  "use strict";
  const RD = window.RD, US = window.US;
  if (!RD || !US) return;
  const { ic, esc, toast } = RD;

  const TAGS = { T: "Terminate", C: "Continue", Q: "Quota", R: "Record", F: "Flag" };
  const TAG_HELP = { T: "end the screener", C: "qualifies", Q: "counts toward a quota", R: "record only", F: "flag for compliance or recruiter review" };
  const METHODS = {
    idi: { label: "In-depth interview, 60 min", short: "60-minute interview", n: 10, video: true },
    survey: { label: "Online survey, 20 min", short: "20-minute online survey", n: 75, video: false },
    group: { label: "Focus group or advisory board, 90 min", short: "90-minute group discussion", n: 8, video: true },
  };
  const GROUPS = [["Physicians", ["hcp", "pcp"]], ["Care team", ["app", "nurse", "allied", "pharm", "lab"]],
    ["Patients & caregivers", ["patient", "caregiver"]], ["Payers & advocacy", ["payer", "advocacy"]]];
  const CLINICAL = ["hcp", "pcp", "app", "nurse", "allied", "pharm", "lab"];
  const ALLIED = /^(Respiratory therapist|Physical therapist|Occupational therapist|Speech-language pathologist|Registered dietitian|Genetic counselor|Psychologist|Social worker|Audiologist|Orthotist|Behavior analyst|Therapists \(PT, OT, speech\)|Mental health clinicians|Low-vision rehabilitation)$/;
  const NOT_TARGET = /^(ICER|Research networks|Donor registry|Blood centers|Medical food suppliers|Schools \(IEP\)|Child protective services|Residential care|Skilled nursing \/ long-term care|Early intervention services|Pulmonary rehab & DME suppliers|Hospital transfusion service|Apheresis unit|Public health screening program)$/;

  /* ---------- who can be screened ---------- */
  function credOf(name, group) { return US.credentialsFor(name, group)[0] || null; }
  function kindOf(name, group) {
    if (group === "patient") return null;
    const cr = credOf(name, group);
    if (!cr) return group === "sys" ? null : "hcp";
    if (cr.kind === "Manufacturer") return null;
    if (/advocacy/i.test(cr.kind)) return "advocacy";
    const t = cr.title;
    if (t === "Payers & PBMs") return "payer";
    if (t === "Pharmacist" || t === "Specialty pharmacy") return "pharm";
    if (t === "Clinical laboratory") return "lab";
    if (t === "Nurse practitioner" || t === "Physician assistant") return "app";
    if (/nurse/i.test(t)) return "nurse";
    if (ALLIED.test(t)) return "allied";
    if (t === "Primary care physician" || t === "Pediatrician") return "pcp";
    if (NOT_TARGET.test(t) || group === "sys") return null;
    return "hcp";
  }
  function targets(P) {
    const out = [], seen = new Set();
    const add = (name, group, kind, role, map) => {
      const k = name.toLowerCase();
      if (!kind || seen.has(k)) return;
      seen.add(k); out.push({ name, group, kind, role, map: map || "" });
    };
    for (const [g, name, , map, role] of P.stakeholders) if (g !== "patient") add(name, g, kindOf(name, g), role, map);
    for (const s of P.specialists) add(s, "care", kindOf(s, "care"), "Specialist for this disease", "");
    const pt = P.stakeholders.find(r => r[0] === "patient");
    add("Patient", "patient", "patient", "Person living with the disease", pt ? pt[3] : "");
    add("Parent or caregiver", "patient", "caregiver", "Parent, guardian or main caregiver", pt ? pt[3] : "");
    if (!out.some(t => t.kind === "payer")) add("Payer (medical or pharmacy director)", "sys", "payer", "Coverage and prior authorization decisions", "");
    if (!out.some(t => t.kind === "advocacy")) add("Patient advocacy leader", "sys", "advocacy", "Leads or represents a patient organization", "");
    return out;
  }
  const leadCount = t => (t.map.match(/L/g) || []).length;
  function pickTarget(list, arg) {
    if (arg) {
      const a = String(arg).toLowerCase();
      const hit = list.find(t => t.name.toLowerCase() === a) || list.find(t => t.name.toLowerCase().includes(a) || a.includes(t.name.toLowerCase()));
      if (hit) return hit;
    }
    const docs = list.filter(t => t.kind === "hcp");
    return docs.sort((a, b) => leadCount(b) - leadCount(a))[0] || list[0];
  }

  /* ---------- disease-driven inputs ---------- */
  function volume(P, kind) {
    const e = P.est || {};
    let n = e.n;
    if (n == null) n = e.kind === "births" ? 3000 : 20000;
    let min = n < 5000 ? 1 : n < 25000 ? 2 : n < 100000 ? 5 : n < 300000 ? 10 : 15;
    let win = n < 5000 ? "in the past 3 years" : "in the past 12 months";
    if (kind === "pcp") { min = Math.max(1, Math.round(min / 5)); if (n < 25000) win = "in the past 5 years"; }
    else if (kind !== "hcp") min = Math.max(1, Math.round(min / 2));
    return { min, win };
  }
  const volOpts = min => min <= 1
    ? [["None", "T"], ["1", "C"], ["2 to 5", "C"], ["More than 5", "C"]]
    : [["None", "T"], [`1 to ${min - 1}`, "T"], [`${min} to ${min * 3}`, "C"], [`More than ${min * 3}`, "C"]];
  function therapies(P) {
    const rx = P.pipeline.filter(r => r[2] === "A" || r[2] === "O").slice(0, 6).map(r => r[0]);
    if (rx.length) return rx;
    return String(P.tx || "").split(/[,;]/).map(s => s.trim()).filter(s => s && s.length < 60).slice(0, 5);
  }
  const shortName = s => String(s).replace(/ \(.*\)$/, "");
  function payerNote(P) {
    return P.age === "older" ? "Mostly older adults, so expect a Medicare-heavy mix (Part D for pharmacy drugs, Part B for clinic-given)."
      : P.age === "peds" ? "Childhood onset: expect a large Medicaid/CHIP share (about 3 in 5 US children are covered at some point)."
        : "Adult onset: expect mostly employer or marketplace plans, plus Medicaid and disability-based Medicare.";
  }

  /* ---------- screener content ---------- */
  function build(P, tg, o) {
    const D = P.name, m = METHODS[o.method], k = tg.kind;
    const cr = credOf(tg.name, tg.group);
    const title = cr && cr.kind === "US requirement" ? cr.title : tg.name;
    const isPt = k === "patient" || k === "caregiver";
    const you = k === "caregiver" ? "the person you care for" : "you";
    const your = k === "caregiver" ? "their" : "your";
    const sections = [];
    let cur = null;
    const sec = t => { cur = { title: t, items: [] }; sections.push(cur); };
    const text = (t, extra = {}) => cur.items.push({ type: "text", t, ...extra });
    const q = (t, opts, extra = {}) => cur.items.push({ type: extra.open ? "open" : extra.multi ? "multi" : "single", t, opts, ...extra });
    const quotas = [];

    /* Introduction */
    sec("Introduction");
    text(isPt
      ? `Thank you for your interest. We are doing a research study about ${k === "caregiver" ? "caring for someone with" : "living with"} ${D} for a healthcare company. This is not a sales call. Your answers are confidential and are only reported together with others. If you qualify, the ${m.short} offers a thank-you payment of $____.`
      : `Thank you for your interest. We are conducting market research about ${D} on behalf of a healthcare company. This is not a sales call and nothing will be promoted. Answers are confidential and reported only in aggregate. If you qualify, the ${m.short} offers an honorarium of $____ at fair market value.`,
      { src: "Method" });
    if (o.ae) text("If you mention a side effect or a problem with a specific company's product, we must pass it to that company so it can meet FDA safety-reporting rules. Your name is shared only if you agree.", { src: "US compliance" });

    /* A. Security & compliance */
    if (o.compliance) {
      sec("A. Security & compliance");
      if (["hcp", "pcp", "app"].includes(k)) text("Keep the sponsor blinded so honoraria stay outside CMS Open Payments (Sunshine Act) reporting.", { src: "US compliance", note: true });
      q("Do you, or does anyone in your household, work for any of these?", [
        ["A pharmaceutical, biotech or medical device company", "T"],
        ["A market research or advertising agency", "T"],
        ["A health insurer or pharmacy benefit manager (PBM)", k === "payer" ? "C" : isPt ? "F" : "T"],
        ["FDA, CMS or another government health agency", "F"],
        ["None of these", "C"]], { multi: true, note: "Terminate if any Terminate answer is selected.", src: "US compliance" });
      q(`When did you last take part in a paid research study about ${isPt ? "your health" : D}?`, [
        ["In the past 3 months", "T"], ["3 to 6 months ago", "C"], ["More than 6 months ago, or never", "C"]], { src: "US compliance" });
      if (isPt) {
        q("Where do you live?", [["In a US state or DC", "Q"], ["Outside the US", "T"]], { note: "Code the state to its Census region for the regional quota.", src: "US quota" });
      } else {
        q("In which state do you mainly work?", [["Vermont, Minnesota or Massachusetts", "F"], ["Any other state or DC", "Q"]],
          { note: "Flag VT, MN and MA for compliance review (state rules on payments to health professionals). Code the state to its Census region.", src: "US compliance" });
        if (k !== "advocacy") q("Are you a federal employee, for example at the VA, a military treatment facility or the Indian Health Service?", [["Yes", "F"], ["No", "C"]],
          { note: "Federal ethics rules can bar honoraria. Check before inviting.", src: "US compliance" });
      }
      quotas.push("Spread across the 4 Census regions (Northeast, Midwest, South, West).");
    }

    /* B. Role & credentials */
    sec(isPt ? "B. About you" : "B. Role & credentials");
    if ((k === "hcp" || k === "pcp") && /center|team|clinic|network/i.test(title)) {
      q(`Which best describes your role at a ${title}?`, [["Physician", "C"], ["Nurse or nurse coordinator", "Q"], ["Other team member (for example, social worker or therapist)", "Q"], ["I don't work at one", "T"]], { src: "Stakeholder map" });
      q("How many years have you worked in this role?", [["Fewer than 2", "T"], ["2 or more", "C"]]);
      q("What share of your professional time is direct patient care?", [["Less than 50%", "T"], ["50% or more", "C"]]);
    } else if (k === "hcp" || k === "pcp") {
      const others = P.specialists.filter(s => s.toLowerCase() !== tg.name.toLowerCase() && s.toLowerCase() !== title.toLowerCase() && ["hcp", "pcp"].includes(kindOf(s, "care"))).slice(0, 3);
      q("What is your primary medical specialty?", [[title, "C"], ...others.map(s => [s, "T"]), ["Other specialty", "T"]],
        { note: others.length ? "Change other specialties to Quota to recruit a specialty mix." : "", src: "Specialists on this page" });
      q("Are you board certified in this specialty?", [[cr && cr.board ? `Yes (${cr.board.replace(/\s*\(.*\)\s*$/, "")})` : "Yes", "C"], ["Board eligible (certification in progress)", "C"], ["No", "T"]], { src: "US credentials" });
      q("How many years have you practiced since finishing residency or fellowship?", [["Fewer than 2", "T"], ["2 to 35", "C"], ["More than 35", "T"]]);
      q("What share of your professional time is direct patient care?", [["Less than 50%", "T"], ["50% or more", "C"]]);
      q("Which best describes your main practice setting?", [["Academic medical center", "Q"], ["Community hospital or health system", "Q"], ["Private or group practice", "Q"], ["Other", "T"]],
        { note: "Quota: at least 30% academic and 30% community." });
      quotas.push("At least 30% academic and 30% community practice settings.");
    } else if (k === "app") {
      q("Which best describes your role?", [["Nurse practitioner", "C"], ["Physician assistant", "C"], ["Other", "T"]]);
      q("Do you hold an active state license and national certification for this role?", [["Yes", "C"], ["No", "T"]], { note: cr ? `${cr.req}. ${cr.board}`.trim() : "", src: "US credentials" });
      q("How many years have you worked in this role?", [["Fewer than 2", "T"], ["2 or more", "C"]]);
      q("What share of your professional time is direct patient care?", [["Less than 50%", "T"], ["50% or more", "C"]]);
    } else if (k === "nurse" || k === "allied" || k === "pharm") {
      q("Which best describes your role?", [[title, "C"], ["Other", "T"]], { src: "Stakeholder map" });
      q("Do you hold the license or credential this role needs in your state?", [["Yes, active", "C"], ["No", "T"]],
        { note: cr ? [cr.req, cr.board ? "Often also: " + cr.board : ""].filter(Boolean).join(". ") : "", src: "US credentials" });
      q("How many years have you worked in this role?", [["Fewer than 2", "T"], ["2 or more", "C"]]);
      if (k === "pharm") q("Where do you mainly work?", [["Specialty pharmacy", "Q"], ["Hospital or health-system pharmacy", "Q"], ["Retail pharmacy", "Q"], ["Other", "T"]], { note: "Quota: include specialty pharmacy if the therapy has limited distribution." });
      else q("What share of your time is direct patient care?", [["Less than 50%", "T"], ["50% or more", "C"]]);
    } else if (k === "lab") {
      q("Which best describes your role?", [["Laboratory director or manager", "C"], ["Pathologist or clinical scientist", "C"], ["Medical laboratory scientist", "Q"], ["Other", "T"]]);
      q("Is your laboratory CLIA-certified?", [["Yes", "C"], ["No or not sure", "T"]], { note: "Every US lab that tests human specimens needs a CLIA certificate from CMS.", src: "US credentials" });
      q("Where is your lab?", [["Hospital or academic lab", "Q"], ["Commercial reference lab", "Q"], ["State public health lab", "Q"], ["Other", "T"]]);
    } else if (k === "payer") {
      q("Which best describes your organization?", [["National commercial health plan", "Q"], ["Regional or Blue Cross Blue Shield plan", "Q"], ["Medicare Advantage or Part D plan", "Q"],
        ["Managed Medicaid plan", "Q"], ["Pharmacy benefit manager (PBM)", "Q"], ["Integrated delivery network (IDN)", "Q"], ["Other", "T"]], { src: "US access" });
      q("Which best describes your role?", [["Medical director", "C"], ["Pharmacy director or clinical pharmacist", "C"], ["P&T committee member", "C"], ["Contracting or trade relations", "Q"], ["Other", "T"]]);
      q("How involved are you in coverage, formulary or prior authorization decisions for rare disease therapies?", [["I make the final decision", "C"], ["I strongly influence it", "C"], ["Not involved", "T"]]);
      q("About how many covered lives does your organization manage?", [["Fewer than 500,000", "T"], ["500,000 to 5 million", "Q"], ["More than 5 million", "Q"]]);
      q("Which benefit do you mainly manage?", [["Pharmacy benefit", "Q"], ["Medical benefit (buy-and-bill, Part B)", "Q"], ["Both", "Q"]], { note: payerNote(P), src: "US access" });
      quotas.push(P.age === "older" ? "Over-weight Medicare Advantage / Part D plans (mostly older patients)." : P.age === "peds" ? "Include managed Medicaid plans (large pediatric Medicaid/CHIP share)." : "Mix commercial plans, PBMs and managed Medicaid.");
    } else if (k === "advocacy") {
      q("Which best describes your role?", [["Paid staff leader (for example, executive director)", "C"], ["Board member", "C"], ["Volunteer or ambassador", "Q"], ["Not involved with a patient organization", "T"]]);
      if (P.orgs.length) q("Which organization are you with?", [...P.orgs.slice(0, 5).map(x => [x, "R"]), ["Another organization", "R"]], { src: "Organizations on this page" });
      q("How long have you held this role?", [["Less than 1 year", "T"], ["1 year or more", "C"]]);
      q(`Do you, or does someone in your family, live with ${D}?`, [["Yes", "Q"], ["No", "Q"]]);
    } else if (k === "patient") {
      q("How old are you?", [["Under 18", "T"], ["18 or older", "C"]], { note: "Under 18: invite a parent or guardian instead (use the Parent or caregiver screener)." });
      q(`Has a doctor diagnosed you with ${D}?`, [["Yes", "C"], ["Not yet, but a doctor suspects it", "F"], ["No", "T"]], { note: "Optional: ask for proof of diagnosis, such as a visit summary, before the interview." });
      q("When were you diagnosed?", [["Less than 1 year ago", "Q"], ["1 to 5 years ago", "Q"], ["More than 5 years ago", "Q"]], { note: "Quota: mix of newly diagnosed and long-term patients." });
      quotas.push("Mix of newly diagnosed (under 1 year) and long-term (5+ years) patients.");
    } else if (k === "caregiver") {
      q("Which describes you?", [["Parent or legal guardian of a child under 18", "C"], ["Main caregiver of an adult", "C"], ["Neither", "T"]]);
      q(`Has a doctor diagnosed the person you care for with ${D}?`, [["Yes", "C"], ["Suspected, not yet confirmed", "F"], ["No", "T"]]);
      q("How old is the person you care for?", [["Under 2", "Q"], ["2 to 11", "Q"], ["12 to 17", "Q"], ["18 or older", "Q"]], { note: "Quota: spread across age bands." });
      if (P.nbs.level !== "none") q("Was the condition first found through newborn screening?", [["Yes", "Q"], ["No, it was found later", "Q"], ["Not sure", "R"]], { note: P.nbs.text, src: "Newborn screening (RUSP)" });
      quotas.push("Spread across the age bands of the people cared for.");
    }

    /* C. Experience with the disease */
    sec(`C. Experience with ${D}`);
    const leadStages = RD.stageList(P, tg.map || "", "L");
    if (["hcp", "pcp", "app", "nurse", "allied", "pharm"].includes(k)) {
      const v = volume(P, k);
      q(`How many patients with ${D} have you personally ${k === "pharm" ? "served" : "managed"} ${v.win}?`, volOpts(v.min),
        { note: `Threshold set from the US estimate (${P.est ? P.est.text : P.prevalence}). Lower it if recruitment is slow.`, src: "US estimate" });
      q(`Which parts of the ${D} patient journey are you directly involved in?`, P.stages.map(s => [s.n, leadStages.includes(s.n) ? "C" : "R"]),
        { multi: true, note: leadStages.length ? `Continue if any Continue stage is picked: this role leads at ${leadStages.join(", ")} on the journey map. Otherwise terminate.` : "Record to balance the sample across the journey.", src: "Journey map" });
      if (k !== "allied" && k !== "nurse") {
        const tx = therapies(P), first = P.approved[0];
        q(k === "pharm" ? `Which of these have you dispensed for ${D} in the past 12 months?` : `Which of these have you prescribed or recommended for ${D} in the past 12 months?`,
          [...tx.map(x => [x, "Q"]), ["None of these", "Q"]],
          { multi: true, note: first ? `Quota: at least half current ${k === "pharm" ? "dispensers" : "prescribers"} of ${shortName(first[0])}.` : "Record the treatment mix.", src: "Pipeline (US status)" });
        if (first) quotas.push(`At least half current ${k === "pharm" ? "dispensers" : "prescribers"} of ${shortName(first[0])}.`);
      }
      if (k === "hcp") {
        q(`Are you an investigator in a ${D} clinical trial?`, [["Yes, currently", "Q"], ["In the past", "Q"], ["No", "C"]], { note: "Cap investigators at about 30% so the sample isn't only key opinion leaders." });
        quotas.push("No more than about 30% clinical trial investigators.");
        const net = P.networks[0];
        if (net) {
          q(`Do you practice at, or refer to, ${net[0]}?`, [["Yes", "Q"], ["No", "Q"], ["Not sure", "R"]], { note: "Quota: include clinicians inside and outside specialist centers.", src: "US care networks" });
          quotas.push(`Mix of clinicians inside and outside ${net[0]}.`);
        }
      }
    } else if (k === "lab") {
      q(`Does your lab run tests used to diagnose ${D}?`, [["Yes, in-house", "C"], ["We send them to a reference lab", "Q"], ["No", "T"]], { note: "Diagnosis on this page: " + P.dx, src: "Journey map" });
      q("About how many of these tests did your lab run in the past 12 months?", [["None", "T"], ["1 to 9", "Q"], ["10 or more", "C"]]);
    } else if (k === "payer") {
      q(`In the past 2 years, have you reviewed coverage or prior authorization criteria for ${P.approved.length ? `a ${D} therapy` : "a rare disease therapy"}?`, [["Yes", "C"], ["No", "T"]], { src: "Pipeline (US status)" });
      if (P.approved.length) q(`Which ${D} therapies has your organization reviewed?`, [...P.approved.slice(0, 5).map(r => [r[0], "R"]), ["None of these", "R"]], { multi: true, src: "Pipeline (US status)" });
    } else if (k === "advocacy") {
      q(`Which parts of the ${D} patient journey does your organization focus on?`, P.stages.map(s => [s.n, "R"]), { multi: true, src: "Journey map" });
    } else {
      q(`Which of these best describes where ${you} ${k === "caregiver" ? "is" : "are"} today?`, P.stages.map(s => [`${s.n}: ${s.d[0]}`, "Q"]),
        { note: "Quota: spread across journey stages.", src: "Journey map" });
      q(`Which doctor mainly manages ${your} ${D} care?`, [...P.specialists.slice(0, 4).map(s => [s, "R"]), ["A primary care doctor", "R"], ["No regular doctor", "R"]], { src: "Specialists on this page" });
      const tx = therapies(P), first = P.approved[0];
      q(`Which treatments ${k === "caregiver" ? "have they" : "have you"} used for ${D}?`, [...tx.map(x => [x, "Q"]), ["None of these", "Q"]],
        { multi: true, note: first ? `Quota: include both users and non-users of ${shortName(first[0])}.` : "Record the treatment mix.", src: "Pipeline (US status)" });
      quotas.push("Spread across journey stages (pre-diagnosis to long-term care).");
      if (first) quotas.push(`Include both users and non-users of ${shortName(first[0])}.`);
    }

    /* D. US access */
    if (["hcp", "pcp", "app", "pharm", "nurse"].includes(k) || isPt || k === "payer" || k === "advocacy") sec("D. US access");
    if (["hcp", "pcp", "app", "pharm", "nurse"].includes(k)) {
      if (P.approved.length) q(`Who handles prior authorization for ${D} therapies in your practice?`, [["I do", "Q"], ["My nurse or office staff", "Q"], ["A specialty pharmacy or manufacturer hub", "Q"], ["Not involved", "R"]], { src: "US access" });
      q(`Which insurance do most of your ${D} patients have?`, [["Medicare", "R"], ["Medicaid or CHIP", "R"], ["Commercial or employer plan", "R"], ["VA or TRICARE", "R"], ["Uninsured", "R"]],
        { multi: true, note: payerNote(P), src: "US access" });
    } else if (isPt) {
      q(`What health insurance covers ${your} ${D} care?`, [["Medicare (including Medicare Advantage)", "Q"], ["Medicaid or CHIP", "Q"], ["Employer or marketplace plan", "Q"], ["VA, TRICARE or Indian Health Service", "Q"], ["No insurance", "Q"]],
        { note: payerNote(P), src: "US access" });
      q(`Has insurance ever denied or delayed a ${D} treatment or test, for example through prior authorization?`, [["Yes", "Q"], ["No", "Q"], ["Not sure", "R"]], { src: "US access" });
      quotas.push(P.age === "older" ? "Payer mix: mostly Medicare, plus some commercial." : P.age === "peds" ? "Payer mix: include Medicaid/CHIP and commercial families." : "Payer mix: commercial, Medicaid and Medicare.");
    } else if (k === "payer") {
      q("Which tools does your organization use for high-cost rare disease drugs?", [["Prior authorization", "R"], ["Step therapy", "R"], ["Specialty tier", "R"], ["Outcomes-based agreements", "R"], ["Copay accumulator or maximizer programs", "R"]], { multi: true, src: "US access" });
    } else if (k === "advocacy") {
      q("Does your organization help patients with insurance or access, such as appeals or copay foundations?", [["Yes", "Q"], ["No", "Q"]], { src: "US access" });
    }

    /* E. Articulation & close */
    sec("E. Articulation & close");
    const open = isPt ? `In a sentence or two, what has been hardest about ${k === "caregiver" ? "caring for someone with" : "living with"} ${D}?`
      : k === "payer" ? `In a sentence or two, what would make a new ${D} therapy easier to cover?`
        : k === "advocacy" ? "In a sentence or two, what is your community's top priority right now?"
          : `In a sentence or two, what is the biggest unmet need in ${D} care in the US today?`;
    q(open, [], { open: true, note: "Look for specific, articulate answers. Flag one-word replies.", src: P.gaps.length ? "Gaps on this page" : "" });
    if (m.video) q(`Can you join a ${m.short} by video with your camera on?`, [["Yes", "C"], ["No", "T"]]);
    text(isPt ? "Thank you. You qualify for this study. We'll confirm a time and send the details by email." : "Thank you. You qualify. We'll confirm a time, the honorarium and the details by email.");

    return { title: `${tg.name} · ${D}`, target: tg, method: m, n: o.n, sections, quotas: [`Total sample: n=${o.n} · ${tg.name}`, ...quotas] };
  }

  /* ---------- render ---------- */
  function shell(P, list, tg, o) {
    const groups = GROUPS.map(([label, kinds]) => {
      const opts = list.filter(t => kinds.includes(t.kind));
      return opts.length ? `<optgroup label="${esc(label)}">${opts.map(t => `<option value="${esc(t.name)}"${t === tg ? " selected" : ""}>${esc(t.name)}</option>`).join("")}</optgroup>` : "";
    }).join("");
    return `
    <div class="dsec">
      <h3>${ic("clipboard")}Screener builder</h3>
      <p class="sub">Pre-filled from this disease's journey map, specialists, therapies, US access data and US estimate. Click any wording to edit it, untick a question to drop it, then copy or download.</p>
      <div class="box"><form class="sform" id="scrForm" onsubmit="return false">
        <label class="field" style="flex:1 1 260px">Stakeholder<select id="scrWho">${groups}</select></label>
        <label class="field" style="flex:1 1 220px">Method<select id="scrMethod">${Object.entries(METHODS).map(([k, v]) => `<option value="${k}"${k === o.method ? " selected" : ""}>${esc(v.label)}</option>`).join("")}</select></label>
        <label class="field" style="width:96px">Target n<input id="scrN" type="number" min="1" max="2000" inputmode="numeric" value="${o.n}"></label>
        <label class="field check"><input type="checkbox" id="scrComp"${o.compliance ? " checked" : ""}>US compliance block</label>
        <label class="field check"><input type="checkbox" id="scrAE"${o.ae ? " checked" : ""}>Adverse-event notice</label>
      </form></div>
    </div>
    <div class="scr-bar">
      <div class="legend-tags">${Object.entries(TAGS).map(([k, v]) => `<span class="logic ${k}" title="${esc(TAG_HELP[k])}">${v}</span>`).join("")}</div>
      <div class="scr-actions">
        <button class="btn" type="button" data-scr="copy">${ic("copy")}Copy</button>
        <button class="btn" type="button" data-scr="docx">${ic("download")}Word</button>
        <button class="btn" type="button" data-scr="csv">${ic("download")}CSV</button>
        <button class="btn primary" type="button" data-scr="ask">${ic("chat")}Tailor with assistant</button>
      </div>
    </div>
    <div id="scrOut"></div>`;
  }
  function renderOut(S) {
    let n = 0;
    const tg = S.target;
    const credLine = tg.group === "patient" ? "" : (() => {
      const c = credOf(tg.name, tg.group);
      return c && c.kind === "US requirement" ? `<button class="linkbtn" type="button" data-cert="${esc(tg.name)}">${ic("badge")} US credentials for ${esc(c.title)}</button>` : "";
    })();
    return `
    <div class="grid2" style="margin-bottom:14px">
      <div class="box"><div class="eyebrow" style="margin-bottom:6px">Recruiting</div>
        <strong style="font-size:15px">${esc(tg.name)}</strong><div style="color:var(--muted);font-size:13px">${esc(tg.role)} · ${esc(S.method.short)} · n=${S.n}</div>
        ${tg.map && RD.stageList(RD.current, tg.map, "L").length ? `<div class="mini"><span>Leads at: ${esc(RD.stageList(RD.current, tg.map, "L").join(", "))}</span></div>` : ""}
        ${credLine ? `<div style="margin-top:8px">${credLine}</div>` : ""}</div>
      <div class="box"><div class="eyebrow" style="margin-bottom:6px">Quota plan</div>
        <ul class="factlist">${S.quotas.map(x => `<li>${ic("target")}<span contenteditable="true" spellcheck="true" class="qquota">${esc(x)}</span></li>`).join("")}</ul></div>
    </div>
    ${S.sections.map(sec => `
      <div class="qsec">${esc(sec.title)}</div>
      <ol class="qlist">${sec.items.map(it => {
        const id = it.type === "text" ? "" : "S" + (++n);
        return `<li class="q${it.type === "text" ? " text" : ""}${it.note === true ? " tip" : ""}" data-type="${it.type}" data-id="${id}">
          <div class="qh"><input type="checkbox" class="qinc" checked aria-label="Include ${id || "this text"}">${id ? `<span class="qn">${id}</span>` : ""}<span class="qt" contenteditable="true" spellcheck="true">${esc(it.t)}</span>${it.type === "multi" ? '<span class="qmulti">Select all</span>' : it.type === "open" ? '<span class="qmulti">Open end</span>' : ""}</div>
          ${typeof it.note === "string" && it.note ? `<div class="qs" contenteditable="true" spellcheck="true">${esc(it.note)}</div>` : ""}
          ${it.opts && it.opts.length ? `<ul>${it.opts.map(([l, tg2]) => `<li data-tag="${tg2}"><span class="ol" contenteditable="true" spellcheck="true">${esc(l)}</span><span class="logic ${tg2}">${TAGS[tg2]}</span></li>`).join("")}</ul>` : ""}
          ${it.src ? `<span class="qsrc">${ic("db")}${esc(it.src)}</span>` : ""}
        </li>`;
      }).join("")}</ol>`).join("")}`;
  }

  /* ---------- read the (edited) screener back from the page ---------- */
  function readOut(root, S) {
    const out = { title: S.title, meta: `${S.method.short} · Target n=${S.n} · Drafted with Rare·Desk (US) on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, sections: [], quotas: [] };
    root.querySelectorAll(".qquota").forEach(el => { const t = el.textContent.trim(); if (t) out.quotas.push(t); });
    let cur = null;
    for (const el of root.children) {
      if (el.classList.contains("qsec")) { cur = { title: el.textContent.trim(), items: [] }; out.sections.push(cur); continue; }
      if (!el.classList.contains("qlist") || !cur) continue;
      for (const li of el.children) {
        if (!li.querySelector(".qinc").checked) continue;
        const it = { type: li.dataset.type, id: li.dataset.id, t: li.querySelector(".qt").textContent.trim(), note: (li.querySelector(".qs")?.textContent || "").trim(), opts: [] };
        li.querySelectorAll("ul > li").forEach(o => it.opts.push([o.querySelector(".ol").textContent.trim(), o.dataset.tag]));
        cur.items.push(it);
      }
    }
    out.sections = out.sections.filter(s => s.items.length);
    return out;
  }
  function toText(X) {
    const L = [`RECRUITMENT SCREENER: ${X.title} (US)`, X.meta, "Logic: T = terminate · C = continue · Q = quota · R = record · F = flag for review", ""];
    for (const s of X.sections) {
      L.push(s.title.toUpperCase());
      for (const it of s.items) {
        if (it.type === "text") { L.push(it.t, ""); continue; }
        L.push(`${it.id}. ${it.t}${it.type === "multi" ? " (select all that apply)" : it.type === "open" ? " (open end)" : ""}`);
        if (it.note) L.push(`    Note: ${it.note}`);
        it.opts.forEach((o, i) => L.push(`    ${i + 1}. ${o[0]}  [${TAGS[o[1]].toUpperCase()}]`));
        L.push("");
      }
    }
    if (X.quotas.length) { L.push("QUOTA PLAN"); X.quotas.forEach(q => L.push("- " + q)); }
    return L.join("\n").trim() + "\n";
  }
  function toCSV(X) {
    const c = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Section", "Number", "Question", "Type", "Note", "Answer", "Logic"]];
    for (const s of X.sections) for (const it of s.items) {
      if (it.type === "text") { rows.push([s.title, "", it.t, "script", "", "", ""]); continue; }
      if (!it.opts.length) rows.push([s.title, it.id, it.t, it.type, it.note, "", "Record"]);
      it.opts.forEach((o, i) => rows.push([s.title, it.id, i ? "" : it.t, i ? "" : it.type, i ? "" : it.note, o[0], TAGS[o[1]]]));
    }
    X.quotas.forEach(q => rows.push(["Quota plan", "", q, "quota", "", "", ""]));
    return "﻿" + rows.map(r => r.map(c).join(",")).join("\r\n") + "\r\n";
  }

  /* ---------- minimal .docx writer (stored zip, no compression) ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(files) {
    const enc = new TextEncoder(), parts = [], central = [];
    let offset = 0;
    const d = new Date(), dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dosDate = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    for (const f of files) {
      const name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [8, 0, 2], [10, dosTime, 2], [12, dosDate, 2], [14, crc, 4], [18, data.length, 4], [22, data.length, 4], [26, name.length, 2], [28, 0, 2]]
        .forEach(([o, v, s]) => s === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
      const c = new DataView(new ArrayBuffer(46));
      [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [10, 0, 2], [12, dosTime, 2], [14, dosDate, 2], [16, crc, 4], [20, data.length, 4], [24, data.length, 4], [28, name.length, 2], [30, 0, 2], [32, 0, 2], [34, 0, 2], [36, 0, 2], [38, 0, 4], [42, offset, 4]]
        .forEach(([o, v, s]) => s === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
      parts.push(new Uint8Array(h.buffer), name, data);
      central.push(new Uint8Array(c.buffer), name);
      offset += 30 + name.length + data.length;
    }
    const cdSize = central.reduce((a, b) => a + b.length, 0);
    const e = new DataView(new ArrayBuffer(22));
    [[0, 0x06054b50, 4], [4, 0, 2], [6, 0, 2], [8, files.length, 2], [10, files.length, 2], [12, cdSize, 4], [16, offset, 4], [20, 0, 2]]
      .forEach(([o, v, s]) => s === 4 ? e.setUint32(o, v, true) : e.setUint16(o, v, true));
    const all = [...parts, ...central, new Uint8Array(e.buffer)], out = new Uint8Array(all.reduce((a, b) => a + b.length, 0));
    let p = 0; for (const a of all) { out.set(a, p); p += a.length; }
    return out;
  }
  function toDocx(X) {
    const x = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
    const COL = { T: "AE3527", C: "1D7650", Q: "1C4A96", R: "56667E", F: "9A6110" };
    const run = (t, o = {}) => `<w:r><w:rPr><w:rFonts w:ascii="Helvetica" w:hAnsi="Helvetica" w:cs="Arial"/>${o.b ? "<w:b/>" : ""}${o.i ? "<w:i/>" : ""}${o.color ? `<w:color w:val="${o.color}"/>` : ""}<w:sz w:val="${o.sz || 21}"/></w:rPr><w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
    const para = (runs, o = {}) => `<w:p><w:pPr>${o.keep ? "<w:keepNext/>" : ""}<w:spacing w:before="${o.before ?? 0}" w:after="${o.after ?? 60}"/>${o.ind ? `<w:ind w:left="${o.ind}"/>` : ""}${o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="19376D"/></w:pBdr>' : ""}</w:pPr>${runs}</w:p>`;
    let body = para(run("Recruitment screener", { b: true, sz: 34, color: "0B2447" }), { after: 40 });
    body += para(run(X.title + " (US)", { b: true, sz: 26, color: "19376D" }), { after: 40 });
    body += para(run(X.meta, { sz: 18, color: "56667E" }), { after: 40 });
    body += para(run("Logic: ", { b: true, sz: 18 }) + Object.entries(TAGS).map(([k, v]) => run(v + "  ", { b: true, sz: 18, color: COL[k] })).join(""), { after: 200 });
    for (const s of X.sections) {
      body += para(run(s.title.toUpperCase(), { b: true, sz: 20, color: "19376D" }), { before: 200, after: 80, border: true, keep: true });
      for (const it of s.items) {
        if (it.type === "text") { body += para(run(it.t, { i: true, sz: 20 }), { after: 120 }); continue; }
        body += para(run(it.id + ".  ", { b: true, color: "1C4A96" }) + run(it.t, { b: true }) + (it.type === "multi" ? run("  (select all that apply)", { i: true, sz: 18, color: "56667E" }) : it.type === "open" ? run("  (open end)", { i: true, sz: 18, color: "56667E" }) : ""), { before: 120, after: 40, keep: true });
        if (it.note) body += para(run("Note: " + it.note, { i: true, sz: 18, color: "56667E" }), { ind: 400, after: 40, keep: !!it.opts.length });
        it.opts.forEach((o, i) => { body += para(run(`${i + 1}.  ${o[0]}`) + run(`   ${TAGS[o[1]].toUpperCase()}`, { b: true, sz: 16, color: COL[o[1]] }), { ind: 400, after: 20, keep: i < it.opts.length - 1 }); });
      }
    }
    if (X.quotas.length) {
      body += para(run("QUOTA PLAN", { b: true, sz: 20, color: "19376D" }), { before: 240, after: 80, border: true, keep: true });
      X.quotas.forEach(q => { body += para(run("•  " + q), { ind: 200, after: 40 }); });
    }
    const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    return zip([
      { name: "[Content_Types].xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>' },
      { name: "_rels/.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
      { name: "word/document.xml", data: doc },
    ]);
  }

  /* ---------- copy & save ---------- */
  let dlP;
  const downloadsCap = () => dlP || (dlP = (window.claude && typeof window.claude.use === "function") ? Promise.resolve(window.claude.use("downloads")).catch(() => null) : Promise.resolve(null));
  async function saveFile(name, data, mime) {
    const dl = await downloadsCap();
    if (dl) {
      try { await dl.save({ filename: name, data }); toast("Saved " + name); return; }
      catch (e) {
        const code = e && e.code;
        if (code === "declined") return;
        if (code === "rate_limited") { toast("A save prompt is already open"); return; }
        if (!["unavailable", "not_granted", "capability_disabled", "capability_removed", "extension_not_enabled"].includes(code)) { toast("Couldn't save the file"); return; }
      }
    }
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: mime }));
      a.download = name; document.body.append(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    } catch (_) { toast("Downloads are blocked here. Use Copy instead."); }
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); toast("Screener copied"); return; } catch (_) { /* fall back */ }
    const ta = document.createElement("textarea");
    ta.value = t; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.append(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    ta.remove();
    toast(ok ? "Screener copied" : "Copy is blocked here. Use Word or CSV instead.");
  }
  const fileBase = S => ("screener-" + RD.current.key + "-" + S.target.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  /* ---------- mount (called by the drawer's Screener tab) ---------- */
  function mount(P, el, arg) {
    if (!el || !P) return;
    downloadsCap();
    const list = targets(P);
    const o = { method: "idi", n: METHODS.idi.n, compliance: true, ae: true };
    let tg = pickTarget(list, arg);
    let S = null;
    el.innerHTML = shell(P, list, tg, o);
    const out = el.querySelector("#scrOut");
    const draw = () => { S = build(P, tg, o); out.innerHTML = renderOut(S); };
    draw();
    el.querySelector("#scrWho").addEventListener("change", e => { tg = list.find(t => t.name === e.target.value) || tg; draw(); });
    el.querySelector("#scrMethod").addEventListener("change", e => { o.method = e.target.value; o.n = METHODS[o.method].n; el.querySelector("#scrN").value = o.n; draw(); });
    el.querySelector("#scrN").addEventListener("change", e => { const v = Math.round(+e.target.value); o.n = v >= 1 && v <= 2000 ? v : METHODS[o.method].n; e.target.value = o.n; draw(); });
    el.querySelector("#scrComp").addEventListener("change", e => { o.compliance = e.target.checked; draw(); });
    el.querySelector("#scrAE").addEventListener("change", e => { o.ae = e.target.checked; draw(); });
    out.addEventListener("change", e => { const li = e.target.closest(".q"); if (li && e.target.classList.contains("qinc")) li.classList.toggle("off", !e.target.checked); });
    out.addEventListener("keydown", e => {
      if (e.key === "Enter" && e.target.isContentEditable) { e.preventDefault(); e.target.blur(); }
      if (e.key === "Escape" && e.target.isContentEditable) { e.stopPropagation(); e.preventDefault(); e.target.blur(); }
    });
    out.addEventListener("paste", e => {
      if (!e.target.isContentEditable) return;
      e.preventDefault();
      const t = (e.clipboardData || window.clipboardData).getData("text").replace(/\s+/g, " ");
      document.execCommand("insertText", false, t);
    });
    el.querySelector(".scr-actions").addEventListener("click", e => {
      const b = e.target.closest("[data-scr]"); if (!b) return;
      const X = readOut(out, S), base = fileBase(S);
      if (b.dataset.scr === "copy") copyText(toText(X));
      else if (b.dataset.scr === "csv") saveFile(base + ".csv", toCSV(X), "text/csv");
      else if (b.dataset.scr === "docx") saveFile(base + ".docx", new Blob([toDocx(X)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      else if (b.dataset.scr === "ask") document.dispatchEvent(new CustomEvent("rd:chat-open", { detail: {
        prompt: `Review this draft screener for a ${S.target.name} (${P.name}, US). Suggest 3 disease-specific knowledge-check questions, flag weak termination logic, and tighten the quotas. Keep it short.`,
        context: { label: `Screener draft · ${S.target.name}`, text: toText(X) },
      } }));
    });
  }

  window.RDScreener = { mount, build, targets, toText, toCSV, toDocx, readOut, isTarget: (name, group) => !!kindOf(name, group) };
})();
