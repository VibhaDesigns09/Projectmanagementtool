/* Rare·Desk screener builder: a seven-step wizard for a US recruitment screener, pre-filled from the open disease profile.
   Stakeholder → certifications → what matters → ranges & quotas → study brief → question types → review & export.
   The Word file carries the brief, who qualifies, every question with its options and logic, the quota plan and the terminations. */
(function () {
  "use strict";
  const RD = window.RD, US = window.US;
  if (!RD || !US) return;
  const { ic, esc, toast } = RD;

  const TAGS = { T: "Terminate", C: "Continue", Q: "Quota", R: "Record", F: "Flag" };
  const TAG_HELP = { T: "end the screener", C: "qualifies", Q: "counts toward a quota", R: "record only", F: "flag for compliance or recruiter review" };
  const METHODS = {
    idi: { label: "In-depth interviews", short: "60-minute interview", n: 10, loi: 60, video: true },
    survey: { label: "Online survey", short: "20-minute online survey", n: 75, loi: 20, video: false },
    group: { label: "Focus groups", short: "90-minute group discussion", n: 8, loi: 90, video: true },
  };
  const QTYPES = {
    single: ["Single choice", "One answer from a list"],
    multi: ["Multiple choice", "Select all that apply"],
    matrix: ["Matrix / grid", "The same scale for several items"],
    field: ["Form field", "Type a number or short text"],
    scale: ["Rating scale", "1 to 5, from low to high"],
    rank: ["Ranking", "Put options in order"],
  };
  const STEPS = [
    ["Stakeholder", "Who is this screener for?", "Pick the person you want to recruit. Everything after this adapts to them."],
    ["Certifications", "Which certifications are required?", "Each one you tick becomes a screening question; “No” terminates."],
    ["What matters", "What matters for this study?", "Pick the criteria that decide who qualifies. You set the limits next."],
    ["Ranges & quotas", "Set the minimum and maximum for each", "Answers outside a range terminate. Quotas keep the sample balanced."],
    ["Study brief", "Tell us about the study", "The brief shapes the study questions in the second part of the screener."],
    ["Question types", "Which kinds of questions do you want?", "Questions use the first allowed type that suits them. You can switch any question in the review."],
    ["Review & export", "Review, edit and export", "Click any wording to edit it, change a question's type or logic, untick what you don't need, then download Word."],
  ];
  const GROUPS = [["Physicians", ["hcp", "pcp"]], ["Care team", ["app", "nurse", "allied", "pharm", "lab"]],
    ["Patients & caregivers", ["patient", "caregiver"]], ["Payers & advocacy", ["payer", "advocacy"]]];
  const CLIN = ["hcp", "pcp", "app", "nurse", "allied", "pharm"];
  const ALLIED = /^(Respiratory therapist|Physical therapist|Occupational therapist|Speech-language pathologist|Registered dietitian|Genetic counselor|Psychologist|Social worker|Audiologist|Orthotist|Behavior analyst|Therapists \(PT, OT, speech\)|Mental health clinicians|Low-vision rehabilitation)$/;
  const NOT_TARGET = /^(ICER|Research networks|Donor registry|Blood centers|Medical food suppliers|Schools \(IEP\)|Child protective services|Residential care|Skilled nursing \/ long-term care|Early intervention services|Pulmonary rehab & DME suppliers|Hospital transfusion service|Apheresis unit|Public health screening program)$/;
  const shortName = s => String(s).replace(/ \(.*\)$/, "");
  const num = v => v === "" || v == null || isNaN(+v) ? null : Math.round(+v);
  const fmt = n => Number(n).toLocaleString("en-US");

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
    const add = (name, group, kind, role, map, icon) => {
      const k = name.toLowerCase();
      if (!kind || seen.has(k)) return;
      seen.add(k); out.push({ name, group, kind, role, map: map || "", icon });
    };
    for (const [g, name, icon, map, role] of P.stakeholders) if (g !== "patient") add(name, g, kindOf(name, g), role, map, icon);
    for (const s of P.specialists) add(s, "care", kindOf(s, "care"), "Specialist for this disease", "", "steth");
    const pt = P.stakeholders.find(r => r[0] === "patient");
    add("Patient", "patient", "patient", "Person living with the disease", pt ? pt[3] : "", "user");
    add("Parent or caregiver", "patient", "caregiver", "Parent, guardian or main caregiver", pt ? pt[3] : "", "users");
    if (!out.some(t => t.kind === "payer")) add("Payer (medical or pharmacy director)", "sys", "payer", "Coverage and prior authorization decisions", "", "coins");
    if (!out.some(t => t.kind === "advocacy")) add("Patient advocacy leader", "sys", "advocacy", "Leads or represents a patient organization", "", "users");
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
  const roleTitle = tg => { const cr = credOf(tg.name, tg.group); return cr && cr.kind === "US requirement" ? cr.title : tg.name; };

  /* ---------- step 2: certifications ---------- */
  function certOptions(P, tg) {
    const k = tg.kind, cr = credOf(tg.name, tg.group), D = P.name, title = roleTitle(tg);
    const board = cr && cr.board ? cr.board.replace(/\s*\((?:often|optional|usually)[^)]*\)/gi, "").trim() : "";
    const genetic = /gene|x-linked|autosomal|mutation|deletion|repeat/i.test(P.cause || "");
    const L = [];
    const add = (id, label, detail, q, on, extra = {}) => L.push({ id, label, detail, q, on, ...extra });
    if (k === "hcp" || k === "pcp") {
      add("license", "Active, unrestricted US medical license (MD or DO)", "Required by law in every state · check on FSMB DocInfo", "Do you hold an active, unrestricted license to practice medicine (MD or DO) in a US state?", true);
      add("board", "Board certified" + (board ? ": " + board : " in the specialty"), "ABMS member board · check on Certification Matters", "Are you board certified in your specialty?", true, { eligible: true, yes: board ? `Yes (${board})` : "Yes" });
      add("fellow", "Fellowship-trained in the specialty", "Completed a fellowship after residency", "Did you complete fellowship training in your specialty?", false);
      add("privileges", "Active hospital privileges", "Treats or admits patients at a US hospital", "Do you hold active clinical privileges at a US hospital?", false);
    } else if (k === "app") {
      add("license", "Active state license (RN + APRN, or PA)", cr ? cr.req : "State license", "Do you hold an active state license as a nurse practitioner or physician assistant?", true);
      add("board", "National certification (AANP, ANCC, PNCB or NCCPA)", "Required for most state licenses", "Are you nationally certified (for example AANP, ANCC or NCCPA PA-C)?", true);
    } else if (k === "nurse" || k === "allied" || k === "pharm") {
      add("license", (cr && cr.req) || "Active state license for this role", "Required to practice", `Do you hold an active license or credential to work as a ${title.toLowerCase()} in your state?`, true);
      if (cr && cr.board) add("board", cr.board, "Professional certification", `Do you hold this certification: ${cr.board}?`, k !== "pharm");
      if (k === "pharm") add("sp", "Specialty pharmacy accreditation (URAC or ACHC)", "Usually required by payers and manufacturers", "Is your pharmacy accredited as a specialty pharmacy (URAC or ACHC)?", false);
    } else if (k === "lab") {
      add("clia", "CLIA-certified laboratory", "Every US lab testing human specimens needs one", "Is your laboratory CLIA-certified?", true);
      add("cap", "CAP accreditation", "College of American Pathologists", "Is your laboratory CAP-accredited?", false);
      add("director", "Board-certified lab director (ABPath, ABMGG or ABB)", "For complex genetic and biochemical testing", "Is your laboratory directed by a board-certified pathologist or geneticist?", false);
    } else if (k === "payer") {
      add("clinical", "Clinical license (MD, DO, PharmD or RN)", "For medical and pharmacy director roles", "Do you hold an active clinical license (MD, DO, PharmD or RN)?", false);
      add("pt", "Pharmacy & therapeutics (P&T) committee member", "Votes on formulary decisions", "Do you sit on a pharmacy & therapeutics (P&T) committee?", false);
    } else if (k === "advocacy") {
      add("nonprofit", "Registered nonprofit organization (501(c)(3))", "Check in the IRS Tax Exempt Organization Search", "Is your organization a registered 501(c)(3) nonprofit?", true);
    } else {
      const cg = k === "caregiver", who = cg ? "the person you care for" : "you";
      add("dx", "Diagnosed by a doctor", `Self-reported diagnosis of ${D}`, `Has a doctor diagnosed ${who} with ${D}?`, true, { patient: true });
      add("specialist", "Diagnosis confirmed by a specialist", (P.specialists[0] || "Specialist") + " or a specialist center", `Was the diagnosis confirmed by a specialist, such as a ${(P.specialists[0] || "specialist").toLowerCase()}?`, false);
      add("proof", "Proof of diagnosis on request", "Visit summary or test result before the interview", "If asked, could you share proof of the diagnosis, such as a visit summary or test result?", false);
      if (genetic) add("genetic", "Confirmed by a genetic test", "Gene or chromosome test", "Was the diagnosis confirmed by a genetic test?", false);
      if (cg) add("guardian", "Legal guardian (for a child under 18)", "Needed to consent for a minor", "Are you the parent or legal guardian of the person you care for?", false);
    }
    return L;
  }

  /* ---------- step 3: what matters ---------- */
  const CRIT_ICON = { exp: "clock", volume: "users", setting: "hospital", dpc: "steth", decision: "check", region: "pin", lives: "shield", benefit: "pill",
    lived: "heart", age: "user", dxtime: "clock", insurance: "coins", stage: "route", treat: "pill", relation: "users" };
  function criteria(P, tg) {
    const k = tg.kind, D = P.name, c = (id, label, hint, on) => ({ id, label, hint, on });
    const region = c("region", "US region", "Quotas across the 4 Census regions", false);
    if (CLIN.includes(k)) return [
      c("exp", "Work experience", "Years in practice after training", true),
      c("volume", "Patient volume", `Patients with ${D} they personally ${k === "pharm" ? "serve" : "manage"}`, true),
      c("setting", k === "pharm" ? "Pharmacy setting" : "Hospital / practice setting", k === "pharm" ? "Specialty, hospital or retail pharmacy" : "Academic, community, private practice…", true),
      c("dpc", "Time in direct patient care", "Share of working time spent with patients", false),
      ...(["hcp", "pcp", "app"].includes(k) ? [c("decision", "Treatment decision role", "Decides, shares the decision or refers", false)] : []),
      region];
    if (k === "lab") return [c("exp", "Work experience", "Years working in the lab", true), c("volume", "Test volume", `Tests for ${D} a year`, true),
      c("setting", "Lab setting", "Hospital, reference or public health lab", true), region];
    if (k === "payer") return [c("exp", "Work experience", "Years in a coverage or formulary role", true), c("lives", "Covered lives", "Size of the plan or PBM", true),
      c("setting", "Organization type", "Commercial, Medicare, Medicaid, PBM…", true), c("benefit", "Benefit managed", "Pharmacy or medical benefit", false), region];
    if (k === "advocacy") return [c("exp", "Years in role", "Time leading or representing the organization", true), c("setting", "Organization type", "National, regional or research foundation", true),
      c("lived", "Lived experience", `Lives with ${D} or cares for someone who does`, false), region];
    if (k === "caregiver") return [c("relation", "Relationship", "Parent, partner, adult child…", true), c("age", "Age of the person cared for", "Youngest and oldest age", true),
      c("dxtime", "Time since diagnosis", "Years since the diagnosis", false), c("insurance", "Insurance type", "Medicare, Medicaid, commercial…", false), region];
    return [c("age", "Age", "Youngest and oldest age", true), c("dxtime", "Time since diagnosis", "Years since the diagnosis", true),
      c("insurance", "Insurance type", "Medicare, Medicaid, commercial…", true), c("stage", "Where they are in the journey", "Quotas across journey stages", false),
      c("treat", "Current treatment", "Users and non-users of therapies", false), region];
  }

  /* ---------- step 4: ranges & quotas ---------- */
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
  const opt = (id, label, on, min, max) => ({ id, label, on, min, max });
  function rangeDefaults(P, tg) {
    const k = tg.kind, v = volume(P, k), age = P.age;
    const SET = k === "pharm" ? [opt("specialty", "Specialty pharmacy", true, 30, 80), opt("hospital", "Hospital or health-system pharmacy", true, 20, 60), opt("retail", "Retail or community pharmacy", false, 0, 30)]
      : k === "lab" ? [opt("hospital", "Hospital or academic lab", true, 30, 80), opt("reference", "Commercial reference lab", true, 20, 70), opt("public", "State public health lab", false, 0, 30)]
        : k === "payer" ? [opt("national", "National commercial plan", true, 20, 50), opt("regional", "Regional or Blue Cross Blue Shield plan", true, 10, 40), opt("ma", "Medicare Advantage or Part D plan", true, age === "older" ? 20 : 10, 40),
          opt("medicaid", "Managed Medicaid plan", true, age === "peds" ? 20 : 10, 40), opt("pbm", "Pharmacy benefit manager (PBM)", true, 10, 40), opt("idn", "Integrated delivery network (IDN)", false, 0, 20)]
          : k === "advocacy" ? [opt("national", "National patient organization", true, 30, 100), opt("regional", "Regional or local group", true, 0, 50), opt("research", "Research foundation", false, 0, 30)]
            : [opt("academic", "Academic medical center", true, 30, 70), opt("community", "Community hospital or health system", true, 30, 70), opt("private", "Private or group practice", true, 0, 40),
              opt("coe", "Specialist center or center of excellence", false, 0, 30), opt("va", "VA or military hospital", false, 0, 10)];
    const INS = age === "older" ? [opt("medicare", "Medicare (incl. Medicare Advantage)", true, 50, 100), opt("commercial", "Employer or marketplace plan", true, 0, 40), opt("medicaid", "Medicaid or CHIP", true, 0, 20)]
      : age === "peds" ? [opt("medicaid", "Medicaid or CHIP", true, 30, 70), opt("commercial", "Employer or marketplace plan", true, 30, 70), opt("medicare", "Medicare (incl. Medicare Advantage)", false, 0, 10)]
        : [opt("commercial", "Employer or marketplace plan", true, 40, 80), opt("medicaid", "Medicaid or CHIP", true, 10, 40), opt("medicare", "Medicare (incl. Medicare Advantage)", true, 0, 30)];
    INS.push(opt("military", "VA, TRICARE or Indian Health Service", true, 0, 20), opt("none", "No insurance", false, 0, 10));
    return {
      exp: { min: k === "advocacy" ? 1 : 2, max: k === "payer" || k === "advocacy" ? null : 35 },
      volume: { min: k === "lab" ? 10 : v.min, max: null, win: k === "lab" ? "in the past 12 months" : v.win, over: "F" },
      dpc: { min: 50 },
      lives: { min: 500000, max: null },
      age: k === "caregiver" ? { min: 0, max: age === "peds" ? 17 : null } : { min: 18, max: null },
      dxtime: { min: 0, max: null },
      setting: { opts: SET },
      insurance: { opts: INS },
      relation: { opts: [opt("parent", "Parent or legal guardian of a child", true, age === "peds" ? 50 : 0, 100), opt("partner", "Spouse or partner", age !== "peds", 0, 100), opt("child", "Adult child", age === "older", 0, 100), opt("other", "Other relative or friend", false, 0, 30)] },
      benefit: { opts: [opt("pharmacy", "Pharmacy benefit", true, 30, 70), opt("medical", "Medical benefit (buy-and-bill, Part B)", true, 30, 70), opt("both", "Both", true, 0, 50)] },
      region: { opts: [opt("ne", "Northeast", true, 15, 35), opt("mw", "Midwest", true, 15, 35), opt("s", "South", true, 20, 45), opt("w", "West", true, 15, 35)] },
      stage: { opts: P.stages.map((s, i) => opt("s" + i, s.n, true, 0, 50)) },
    };
  }
  const NUM_RANGES = {
    exp: ["years", "Years"], volume: ["patients", "Patients"], dpc: ["%", "Percent"], lives: ["covered lives", "Lives"],
    age: ["years old", "Age"], dxtime: ["years", "Years"],
  };
  const LIST_RANGES = ["setting", "insurance", "relation", "benefit", "region", "stage"];

  /* ---------- step 5: study brief ---------- */
  function products(P) {
    return P.pipeline.filter(r => r[2] !== "X").slice(0, 8).map(r => ({ name: shortName(r[0]), st: r[2], on: r[2] === "A" || r[2] === "F" || r[2] === "O" }));
  }
  function topics(P, tg) {
    const k = tg.kind, clin = CLIN.includes(k), pt = k === "patient" || k === "caregiver";
    const dev = P.pipeline.some(r => ["F", "3", "2", "1"].includes(r[2])), rx = products(P).length > 0;
    const genetic = /gene|x-linked|autosomal|mutation|deletion|repeat/i.test(P.cause || "");
    const T = [], t = (id, label, on) => T.push({ id, label, on });
    if (clin || pt) t("dx", "Diagnosis & referral journey", true);
    if (clin || pt) t("tx", "Current treatment approach", true);
    if (rx && k !== "lab" && k !== "advocacy") t("aware", "Awareness & use of therapies", true);
    if (dev && (clin || k === "payer")) t("pipeline", "Therapies in development", true);
    t("needs", "Unmet needs & gaps", true);
    if (k !== "lab" && k !== "advocacy") t("access", "Access, coverage & prior authorization", !pt || k === "payer");
    if (clin || pt) t("support", "Patient support & adherence", false);
    if (genetic && (clin || pt || k === "lab")) t("genetic", "Genetic testing & counseling", false);
    if (k === "patient") t("qol", "Daily life & quality of life", true);
    if (k === "caregiver") t("burden", "Caregiving time & burden", true);
    if (k === "payer") t("value", "Evidence, value & pricing", true);
    if (k === "lab") t("workflow", "Testing workflow & turnaround", true);
    if (k === "advocacy") t("priorities", "Community & policy priorities", true);
    return T;
  }
  function briefDefaults(P, tg, prev) {
    const m = prev ? prev.method : "idi";
    return {
      title: `${P.name}: ${tg.name} research`, objective: prev ? prev.objective : "", method: m, n: prev ? prev.n : METHODS[m].n, loi: prev ? prev.loi : METHODS[m].loi,
      topics: topics(P, tg).filter(t => t.on).map(t => t.id), products: products(P).filter(p => p.on).map(p => p.name), extra: prev ? prev.extra : "",
      timing: prev ? prev.timing : "", incentive: prev ? prev.incentive : "",
      compliance: prev ? prev.compliance : true, ae: prev ? prev.ae : true, blinded: prev ? prev.blinded : true, video: prev ? prev.video : METHODS[m].video,
    };
  }
  const TYPE_DEFAULT = { single: true, multi: true, matrix: true, field: true, scale: true, rank: false };

  /* state for one target with every choice at its default */
  function defaults(P, tg, prevBrief) {
    return { tg, certs: certOptions(P, tg), eligible: true, crit: criteria(P, tg), R: rangeDefaults(P, tg), B: briefDefaults(P, tg, prevBrief), T: { ...TYPE_DEFAULT } };
  }

  /* ---------- the screener ----------
     Each question keeps one or more forms ("alts"), one per type it can take; the review switches between them. */
  function build(P, tg, o = {}) {
    const W = o.certs ? { certs: o.certs, eligible: o.eligible, crit: o.crit, R: o.R, B: o.B, T: o.T } : (() => { const d = defaults(P, tg); Object.assign(d.B, { method: o.method || d.B.method, n: o.n || d.B.n, compliance: o.compliance ?? true, ae: o.ae ?? true }); d.B.loi = METHODS[d.B.method].loi; d.B.video = METHODS[d.B.method].video; return d; })();
    const D = P.name, k = tg.kind, B = W.B, R = W.R, T = W.T, m = METHODS[B.method] || METHODS.idi;
    const on = id => W.crit.some(c => c.id === id && c.on);
    const title = roleTitle(tg), isPt = k === "patient" || k === "caregiver", cg = k === "caregiver";
    const you = cg ? "the person you care for" : "you", your = cg ? "their" : "your";
    const pick = alts => { const ks = Object.keys(alts); return ks.find(t => T[t]) || ks[0]; };
    const sections = [], quotas = [];
    let cur = null, n = 0;
    const sec = t => { cur = { title: t, items: [] }; sections.push(cur); };
    const text = t => cur.items.push({ type: "text", t, inc: true, alts: {} });
    const q = (t, alts, extra = {}) => cur.items.push({ id: "S" + (++n), t, alts, type: extra.type && alts[extra.type] && T[extra.type] ? extra.type : pick(alts), note: extra.note || "", src: extra.src || "", inc: true });
    const choice = opts => ({ opts });
    const quota = (label, min, max) => quotas.push({ label, min: min ?? null, max: max ?? null });
    /* numeric criterion: a number field with range rules, or single-choice bands */
    const numeric = (t, unit, lo, hi, extra = {}) => {
      const below = extra.below || "T", above = extra.above || "T", u = unit === "%" ? "%" : " " + unit;
      if (!lo && hi == null) { q(t, { field: { field: { kind: "number", unit }, opts: [["Any answer", "C"]] }, ...(extra.bands ? { single: choice(extra.bands) } : {}) }, extra); return; }
      const rules = [[lo > 0 ? `Less than ${fmt(lo)}${u}` : "", below], [hi != null ? `${fmt(lo)} to ${fmt(hi)}${u}` : `${fmt(lo)}${u} or more`, "C"], [hi != null ? `More than ${fmt(hi)}${u}` : "", above]].filter(r => r[0]);
      const nice = v => v > 100 ? Math.round(v / 10) * 10 : v > 20 ? Math.round(v / 5) * 5 : Math.round(v);
      const mid = hi != null ? Math.min(hi - 1, Math.max(lo + 1, nice((lo + hi) / 2))) : nice(lo * 3) || 10;
      const bands = [[lo > 0 ? `Less than ${fmt(lo)}${u}` : "", below], [hi != null ? `${fmt(lo)} to ${fmt(mid)}${u}` : `${fmt(lo)} to ${fmt(mid)}${u}`, "C"],
        [hi != null ? `${fmt(mid + 1)} to ${fmt(hi)}${u}` : `More than ${fmt(mid)}${u}`, "C"], [hi != null ? `More than ${fmt(hi)}${u}` : "", above]].filter(r => r[0]);
      q(t, { field: { field: { kind: "number", unit, min: lo, max: hi }, opts: rules }, single: choice(bands) }, extra);
    };
    const listQ = (t, key, extra = {}) => {
      const L = R[key].opts, acc = L.filter(x => x.on), cnt = extra.tag || "Q";
      q(t, { single: choice([...L.map(x => [x.label, x.on ? cnt : "T"]), ...(extra.other === false ? [] : [[extra.other || "Other", "T"]])]) }, extra);
      for (const x of acc) if (x.min || (x.max != null && x.max < 100)) quota(`${extra.qlabel || ""}${x.label}`, x.min || 0, x.max);
    };

    /* Introduction */
    sec("Introduction");
    text(isPt
      ? `Thank you for your interest. We are doing a research study about ${cg ? "caring for someone with" : "living with"} ${D} for a healthcare company. This is not a sales call. Your answers are confidential and are only reported together with others. If you qualify, the ${m.short} offers a thank-you payment of ${B.incentive ? "$" + fmt(B.incentive) : "$____"}.`
      : `Thank you for your interest. We are conducting market research about ${D} on behalf of a healthcare company${B.blinded ? " that will not be named" : ""}. This is not a sales call and nothing will be promoted. Answers are confidential and reported only in aggregate. If you qualify, the ${m.short} offers an honorarium of ${B.incentive ? "$" + fmt(B.incentive) : "$____"} at fair market value.`);
    if (B.ae) text("If you mention a side effect or a problem with a specific company's product, we must pass it to that company so it can meet FDA safety-reporting rules. Your name is shared only if you agree.");

    /* A. Screening & compliance */
    if (B.compliance) {
      sec("A. Screening & compliance");
      q("Do you, or does anyone in your household, work for any of these?", { multi: choice([
        ["A pharmaceutical, biotech or medical device company", "T"], ["A market research or advertising agency", "T"],
        ["A health insurer or pharmacy benefit manager (PBM)", k === "payer" ? "C" : isPt ? "F" : "T"],
        ["FDA, CMS or another government health agency", "F"], ["None of these", "C"]]) }, { note: "Terminate if any Terminate answer is selected.", src: "US compliance" });
      q(`When did you last take part in a paid research study about ${isPt ? "your health" : D}?`, { single: choice([["In the past 3 months", "T"], ["3 to 6 months ago", "C"], ["More than 6 months ago, or never", "C"]]) }, { src: "US compliance" });
      if (isPt) q("Where do you live?", { single: choice([["In a US state or DC", "C"], ["Outside the US", "T"]]) });
      else {
        q("In which state do you mainly work?", { single: choice([["Vermont, Minnesota or Massachusetts", "F"], ["Any other state or DC", "C"]]) },
          { note: "Flag VT, MN and MA for compliance review (state rules on payments to health professionals).", src: "US compliance" });
        if (k !== "advocacy") q("Are you a federal employee, for example at the VA, a military treatment facility or the Indian Health Service?", { single: choice([["Yes", "F"], ["No", "C"]]) },
          { note: "Federal ethics rules can bar honoraria. Check before inviting.", src: "US compliance" });
      }
      if (B.blinded && ["hcp", "pcp", "app"].includes(k)) text("Programmer note: keep the sponsor blinded so honoraria stay outside CMS Open Payments (Sunshine Act) reporting.");
    }

    /* B. Who qualifies: role, certifications, then the chosen criteria with their ranges */
    sec(isPt ? "B. About you" : "B. Role & qualifications");
    if (k === "hcp" || k === "pcp") {
      const others = P.specialists.filter(s => s.toLowerCase() !== tg.name.toLowerCase() && s.toLowerCase() !== title.toLowerCase() && ["hcp", "pcp"].includes(kindOf(s, "care"))).slice(0, 3);
      q("What is your primary medical specialty?", { single: choice([[title, "C"], ...others.map(s => [s, "T"]), ["Other specialty", "T"]]) },
        { note: others.length ? "Change other specialties to Quota to recruit a specialty mix." : "", src: "Specialists on this page" });
    } else if (k === "app") q("Which best describes your role?", { single: choice([["Nurse practitioner", "C"], ["Physician assistant", "C"], ["Other", "T"]]) });
    else if (k === "nurse" || k === "allied" || k === "pharm") q("Which best describes your role?", { single: choice([[title, "C"], ["Other", "T"]]) }, { src: "Stakeholder map" });
    else if (k === "lab") q("Which best describes your role?", { single: choice([["Laboratory director or manager", "C"], ["Pathologist or clinical scientist", "C"], ["Medical laboratory scientist", "Q"], ["Other", "T"]]) });
    else if (k === "payer") q("Which best describes your role?", { single: choice([["Medical director", "C"], ["Pharmacy director or clinical pharmacist", "C"], ["P&T committee member", "C"], ["Contracting or trade relations", "Q"], ["Other", "T"]]) });
    else if (k === "advocacy") q("Which best describes your role?", { single: choice([["Paid staff leader (for example, executive director)", "C"], ["Board member", "C"], ["Volunteer or ambassador", "Q"], ["Not involved with a patient organization", "T"]]) });
    else if (k === "caregiver") q("Which describes you?", { single: choice([["Parent or legal guardian of a child under 18", "C"], ["Main caregiver of an adult", "C"], ["Neither", "T"]]) });

    for (const c of W.certs.filter(c => c.on)) {
      if (c.patient) q(c.q, { single: choice([["Yes", "C"], ["Not yet, a doctor suspects it", "F"], ["No", "T"]]) }, { src: "Certifications step" });
      else q(c.q, { single: choice(c.eligible ? [[c.yes || "Yes", "C"], ["Board eligible (certification in progress)", W.eligible ? "C" : "T"], ["No", "T"]] : [["Yes", "C"], ["No", "T"]]) }, { note: c.detail, src: "US credentials" });
    }
    if (on("exp")) {
      const r = R.exp;
      numeric(k === "hcp" || k === "pcp" ? "How many years have you practiced since finishing residency or fellowship?" : k === "payer" ? "How many years have you worked in a coverage, formulary or prior authorization role?" : k === "advocacy" ? "How long have you held this role (years)?" : `How many years have you worked as a ${title.toLowerCase()}?`,
        "years", r.min || 0, r.max, { src: "Ranges step" });
    }
    if (on("volume")) {
      const r = R.volume, unit = k === "lab" ? "tests" : "patients";
      numeric(k === "lab" ? `About how many tests related to ${D} did your lab run ${r.win}?` : `How many patients with ${D} have you personally ${k === "pharm" ? "served" : "managed"} ${r.win}?`,
        unit, r.min || 0, r.max, { above: r.over, note: `Minimum set from the US estimate: ${String(P.est ? P.est.text : P.prevalence).replace(/\s*\([^)]*\)\s*$/, "")}.${r.max != null ? ` Above ${fmt(r.max)}: ${r.over === "T" ? "terminate" : "flag for review (possible over-claiming)"}.` : ""}`, src: "US estimate" });
    }
    if (on("dpc")) numeric("What percentage of your professional time do you spend in direct patient care?", "%", R.dpc.min || 0, 100, { src: "Ranges step" });
    if (on("decision")) q(`What is your role in choosing treatment for patients with ${D}?`, { single: choice([["I make the final decision", "C"], ["I share the decision with colleagues", "C"], ["I refer them; someone else decides", "T"]]) });
    if (on("setting")) listQ(k === "payer" ? "Which best describes your organization?" : k === "advocacy" ? "Which best describes your organization?" : k === "lab" ? "Where is your laboratory?" : k === "pharm" ? "Where do you mainly work?" : "Which best describes your main practice setting?", "setting", { note: "Not accepted: terminate. Quotas from the ranges step.", src: "Ranges step", qlabel: "Setting: " });
    if (on("lives")) numeric("About how many covered lives does your organization manage?", "lives", R.lives.min || 0, R.lives.max, { src: "Ranges step" });
    if (on("benefit")) listQ("Which benefit do you mainly manage?", "benefit", { other: false, qlabel: "Benefit: " });
    if (on("lived")) q(`Do you, or does someone in your family, live with ${D}?`, { single: choice([["Yes", "Q"], ["No", "Q"]]) });
    if (on("relation")) listQ("How are you related to the person you care for?", "relation", { qlabel: "Relationship: " });
    if (on("age")) {
      const r = R.age;
      numeric(cg ? "How old is the person you care for?" : "How old are you?", "years old", r.min || 0, r.max, { note: !cg && r.min >= 18 ? "Under 18: invite a parent or guardian instead (use the caregiver screener)." : "" });
    }
    if (on("dxtime")) numeric(`How many years ago was ${cg ? "the person you care for" : "your"} diagnosis${cg ? " made" : ""}?`, "years", R.dxtime.min || 0, R.dxtime.max,
      { note: "Quota: mix of newly diagnosed (under 1 year) and long-term (5+ years) patients.", bands: [["Less than 1 year", "Q"], ["1 to 5 years", "Q"], ["More than 5 years", "Q"]] });
    if (on("insurance")) listQ(`What health insurance covers ${your} ${D} care?`, "insurance", { qlabel: "Insurance: ", src: "US access" });
    if (on("stage")) listQ(`Which of these best describes where ${you} ${cg ? "is" : "are"} today?`, "stage", { other: false, qlabel: "Journey stage: ", src: "Journey map" });
    if (on("treat")) {
      const rx = products(P).map(x => x.name).slice(0, 6);
      q(`Which treatments ${cg ? "have they" : "have you"} used for ${D}?`, { multi: choice([...(rx.length ? rx : String(P.tx || "").split(/[,;]/).map(s => s.trim()).filter(Boolean).slice(0, 5)).map(x => [x, "Q"]), ["None of these", "Q"]]) }, { note: "Quota: include users and non-users of current therapies.", src: "Pipeline (US status)" });
    }
    if (on("region")) listQ(isPt ? "In which US region do you live?" : "In which US region do you mainly work?", "region", { other: "Outside the US", qlabel: "Region: ", note: "Code the state to its Census region." });
    if (k === "hcp" && B.topics.includes("pipeline")) { q(`Are you an investigator in a ${D} clinical trial?`, { single: choice([["Yes, currently", "Q"], ["In the past", "Q"], ["No", "C"]]) }, { note: "Cap investigators at about 30% so the sample isn't only key opinion leaders." }); quota("Clinical trial investigators", 0, 30); }

    /* C. Study questions from the brief */
    const prods = [...B.products, ...String(B.extra || "").split(",").map(s => s.trim()).filter(Boolean)].slice(0, 8);
    const devp = P.pipeline.filter(r => ["F", "3", "2", "1"].includes(r[2])).map(r => shortName(r[0])).slice(0, 6);
    const gaps = P.gaps.map(g => g[1]).slice(0, 8);
    sec("C. Study questions");
    if (B.objective) text("Study objective: " + B.objective);
    const has = id => B.topics.includes(id);
    if (has("dx")) {
      const bands = [["Less than 6 months", "R"], ["6 to 12 months", "R"], ["1 to 3 years", "R"], ["More than 3 years", "R"]];
      if (isPt) q(`About how long did it take to get ${cg ? "their" : "your"} diagnosis after symptoms started?`, { single: choice(bands.map(([l]) => [l, "Q"])), field: { field: { kind: "number", unit: "months" }, opts: [["Any answer", "Q"]] } }, { note: "Quota: spread across fast and slow diagnoses.", src: "Journey map" });
      else q(`On average, how long does it take your patients to be diagnosed with ${D} after symptoms start?`, { single: choice(bands), field: { field: { kind: "number", unit: "months" }, opts: [["Any answer", "R"]] } }, { src: "Journey map" });
    }
    if (has("tx")) {
      const tx = String(P.tx || "").split(/[,;]/).map(s => s.trim()).filter(s => s && s.length < 70).slice(0, 6);
      if (tx.length >= 2) q(isPt ? `Which of these are part of ${your} care today?` : `Which of these do you use for most of your ${D} patients?`,
        { multi: choice([...tx.map(x => [x[0].toUpperCase() + x.slice(1), isPt ? "Q" : "R"]), ["None of these", "R"]]), rank: choice(tx.map(x => [x[0].toUpperCase() + x.slice(1), "R"])) }, { src: "Treatment on this page" });
    }
    if (has("aware") && prods.length) {
      const cols = isPt ? [["Never heard of it", "R"], ["Heard of it, never taken it", "R"], ["Took it in the past", "Q"], ["Take it now", "Q"]]
        : [["Not aware", "R"], ["Aware, never prescribed", "R"], ["Prescribed in the past", "Q"], ["Prescribe now", "Q"]];
      q(isPt ? `How familiar are you with these ${D} treatments?` : `For each ${D} treatment, which best describes you?`,
        { matrix: { rows: prods, cols }, multi: choice([...prods.map(x => [x, "Q"]), ["None of these", "Q"]]) },
        { note: prods[0] ? `Quota: at least half ${isPt ? "current users" : "current prescribers"} of ${prods[0]}.` : "", src: "Products in the brief" });
      if (prods[0]) quota(`${isPt ? "Current users" : "Current prescribers"} of ${prods[0]}`, 50, null);
    }
    if (has("pipeline") && devp.length) {
      q("How familiar are you with these therapies in development?", { matrix: { rows: devp, cols: [["Not at all", "R"], ["Slightly", "R"], ["Somewhat", "R"], ["Very", "R"], ["Extremely", "R"]] },
        multi: choice([...devp.map(x => [x, "R"]), ["None of these", "R"]]) }, { src: "Pipeline (US status)" });
    }
    if (has("needs") && gaps.length >= 2) {
      q(isPt ? `Which of these have been hardest for ${cg ? "the person you care for" : "you"}? Pick up to 3.` : `Which of these are the biggest gaps in ${D} care today? Pick up to 3.`,
        { rank: choice(gaps.slice(0, 6).map(g => [g, "R"])), multi: choice(gaps.map(g => [g, "R"])) }, { src: "Gaps on this page" });
    }
    if (has("access")) {
      if (k === "payer") q(`Which tools does your organization use for high-cost ${D} therapies?`, { multi: choice([["Prior authorization", "R"], ["Step therapy", "R"], ["Specialty tier", "R"], ["Outcomes-based agreements", "R"], ["Copay accumulator or maximizer programs", "R"]]) }, { src: "US access" });
      else if (isPt) q(`Has insurance ever denied or delayed a ${D} test or treatment, for example through prior authorization?`, { single: choice([["Yes", "Q"], ["No", "Q"], ["Not sure", "R"]]) }, { src: "US access" });
      else q(`How often do prior authorization or coverage problems delay treatment for your ${D} patients?`, { scale: { points: 5, lo: "Never", hi: "Always", opts: [["1 to 2", "R"], ["3 to 5", "R"]] }, single: choice([["Never", "R"], ["Rarely", "R"], ["Sometimes", "R"], ["Often", "R"], ["Always", "R"]]) }, { src: "US access" });
    }
    if (has("support")) q(`How satisfied are you with the support available for ${D} ${isPt ? "patients and families" : "patients"} (hubs, copay help, nurse support)?`,
      { scale: { points: 5, lo: "Very dissatisfied", hi: "Very satisfied", opts: [["1 to 2", "R"], ["3", "R"], ["4 to 5", "R"]] }, single: choice([["Very dissatisfied", "R"], ["Dissatisfied", "R"], ["Neutral", "R"], ["Satisfied", "R"], ["Very satisfied", "R"]]) });
    if (has("genetic")) {
      if (isPt) q(`Has ${cg ? "the person you care for" : "you"} had genetic testing for ${D}?`, { single: choice([["Yes, it confirmed the diagnosis", "Q"], ["Yes, but it was inconclusive", "Q"], ["No", "Q"], ["Not sure", "R"]]) });
      else q(`When you suspect ${D}, how often do you order genetic testing?`, { single: choice([["Always", "R"], ["Sometimes", "R"], ["Rarely or never", "R"], ["I refer to genetics instead", "R"]]), scale: { points: 5, lo: "Never", hi: "Always", opts: [["Any answer", "R"]] } });
    }
    if (has("qol")) q(`How much does ${D} affect each part of your life?`, { matrix: { rows: ["Physical activity", "Work or school", "Sleep", "Emotional wellbeing", "Social life"], cols: [["Not at all", "R"], ["A little", "R"], ["Somewhat", "R"], ["A lot", "R"]] },
      scale: { points: 10, lo: "No effect", hi: "Severe effect", opts: [["1 to 3", "Q"], ["4 to 7", "Q"], ["8 to 10", "Q"]] } }, { note: "Quota: a mix of mild and severe impact." });
    if (has("burden")) q("About how many hours a week do you spend caring for them?", { field: { field: { kind: "number", unit: "hours a week" }, opts: [["Any answer", "R"]] }, single: choice([["Less than 10", "R"], ["10 to 20", "R"], ["21 to 40", "R"], ["More than 40", "R"]]) });
    if (has("value")) q(`What evidence matters most when you review a new ${D} therapy?`, { rank: choice([["Clinical trial outcomes", "R"], ["Real-world evidence", "R"], ["Budget impact", "R"], ["ICER value assessment", "R"], ["Guideline recommendations", "R"], ["Outcomes-based contract options", "R"]]), multi: choice([["Clinical trial outcomes", "R"], ["Real-world evidence", "R"], ["Budget impact", "R"], ["ICER value assessment", "R"], ["Guideline recommendations", "R"], ["Outcomes-based contract options", "R"]]) });
    if (has("workflow")) q(`What is your usual turnaround time for ${D}-related testing?`, { field: { field: { kind: "number", unit: "days" }, opts: [["Any answer", "R"]] }, single: choice([["Under a week", "R"], ["1 to 2 weeks", "R"], ["3 to 4 weeks", "R"], ["More than 4 weeks", "R"]]) });
    if (has("priorities")) q("Rank your community's priorities for the next two years.", { rank: choice([["Faster diagnosis", "R"], ["Access to therapies", "R"], ["Research funding", "R"], ["Newborn screening", "R"], ["Care coordination", "R"], ["Caregiver support", "R"]]), multi: choice([["Faster diagnosis", "R"], ["Access to therapies", "R"], ["Research funding", "R"], ["Newborn screening", "R"], ["Care coordination", "R"], ["Caregiver support", "R"]]) });
    if (!cur.items.length) text("Add study questions here, or pick topics in the study brief.");

    /* D. Articulation & close */
    sec("D. Articulation & close");
    q(isPt ? `In a sentence or two, what has been hardest about ${cg ? "caring for someone with" : "living with"} ${D}?`
      : k === "payer" ? `In a sentence or two, what would make a new ${D} therapy easier to cover?`
        : k === "advocacy" ? "In a sentence or two, what is your community's top priority right now?"
          : `In a sentence or two, what is the biggest unmet need in ${D} care in the US today?`,
    { field: { field: { kind: "text" }, opts: [["Specific, articulate answer", "C"], ["One-word or off-topic answer", "F"]] } }, { note: "Look for specific, articulate answers. Flag one-word replies.", src: P.gaps.length ? "Gaps on this page" : "" });
    if (B.video) q(`Can you join a ${m.short} by video with your camera on?`, { single: choice([["Yes", "C"], ["No", "T"]]) });
    if (B.method !== "survey") q("Do you agree to the session being recorded for research purposes only?", { single: choice([["Yes", "C"], ["No", "T"]]) });
    text(isPt ? "Thank you. You qualify for this study. We'll confirm a time and send the details by email." : "Thank you. You qualify. We'll confirm a time, the honorarium and the details by email.");

    return { title: `${tg.name} · ${D}`, target: tg, method: m, n: B.n, sections, quotas, W, P };
  }

  /* ---------- who qualifies (for the review and the Word file) ---------- */
  function criteriaLines(S) {
    const W = S.W, R = W.R, out = [];
    const certs = W.certs.filter(c => c.on).map(c => c.label + (c.eligible && W.eligible ? " (board eligible accepted)" : ""));
    out.push(["Stakeholder", `${S.target.name} (${S.target.role})`]);
    out.push([S.target.kind === "patient" || S.target.kind === "caregiver" ? "Diagnosis" : "Certifications", certs.length ? certs.join("; ") : "None required"]);
    for (const c of W.crit.filter(c => c.on)) {
      const r = R[c.id];
      if (NUM_RANGES[c.id]) out.push([c.label, `${r.max != null ? `${fmt(r.min || 0)} to ${fmt(r.max)}` : `At least ${fmt(r.min || 0)}`} ${NUM_RANGES[c.id][0]}${c.id === "volume" ? " " + r.win : ""}`]);
      else if (LIST_RANGES.includes(c.id)) out.push([c.label, r.opts.filter(x => x.on).map(x => `${x.label}${x.min || (x.max != null && x.max < 100) ? ` (${x.min || 0}–${x.max ?? 100}%)` : ""}`).join("; ") + (r.opts.some(x => !x.on) ? "; others terminate" : "")]);
      else out.push([c.label, "Asked and recorded"]);
    }
    return out;
  }
  function terms(S) {
    const L = [];
    for (const s of S.sections) for (const q of s.items) {
      if (!q.inc || q.type === "text") continue;
      const a = q.alts[q.type];
      if (q.type === "matrix") a.cols.filter(c => c[1] === "T").forEach(c => L.push([q.id, `“${c[0]}” for any row`]));
      else (a.opts || []).filter(o => o[1] === "T").forEach(o => L.push([q.id, o[0]]));
    }
    return L;
  }

  /* ---------- wizard UI ---------- */
  const tick = () => `<span class="tick">${ic("tick")}</span>`;
  function stepSummary(st, i) {
    const on = st.crit.filter(c => c.on).length, certs = st.certs.filter(c => c.on).length, types = Object.values(st.T).filter(Boolean).length;
    return [st.tg.name, certs ? `${certs} required` : "None required", `${on} criteria`, "Limits & quotas", `${METHODS[st.B.method].label} · n=${st.B.n}`, `${types} type${types === 1 ? "" : "s"}`, st.S ? "Ready to export" : "Builds the screener"][i];
  }
  function navHTML(st) {
    return `<ol>${STEPS.map((s, i) => `<li><button type="button" class="wst${i < st.step ? " done" : ""}" data-wstep="${i}"${i === st.step ? ' aria-current="step"' : ""}><span class="wn">${i + 1}</span><span class="wtx"><b>${s[0]}</b><small>${esc(stepSummary(st, i))}</small></span></button></li>`).join("")}</ol>`;
  }
  function stepWho(st) {
    return GROUPS.map(([label, kinds]) => {
      const L = st.list.filter(t => kinds.includes(t.kind)); if (!L.length) return "";
      return `<div class="wgroup"><h3>${label}</h3><div class="wopts">${L.map(t => `<label class="wopt g-${t.group}"><input type="radio" name="wwho" value="${esc(t.name)}"${t === st.tg ? " checked" : ""}>
        <span class="wico">${ic(t.icon || "user")}</span><span><b>${esc(t.name)}</b><small>${esc(t.role)}${leadCount(t) ? ` · leads at ${leadCount(t)} stage${leadCount(t) > 1 ? "s" : ""}` : ""}</small></span>${tick()}</label>`).join("")}</div></div>`;
    }).join("");
  }
  function stepCerts(st) {
    if (!st.certs.length) return `<p class="none">No certification applies to ${esc(st.tg.name)}.</p>`;
    return `<div class="wlist">${st.certs.map(c => `<div><label class="wopt"><input type="checkbox" data-cert="${c.id}"${c.on ? " checked" : ""}>
      <span class="wico">${ic(c.patient || c.id === "dx" ? "check" : "badge")}</span><span><b>${esc(c.label)}</b><small>${esc(c.detail)}</small></span>${tick()}</label>
      ${c.eligible && c.on ? `<label class="wsub"><input type="checkbox" data-eligible${st.eligible ? " checked" : ""}>Accept board-eligible (certification in progress)</label>` : ""}</div>`).join("")}</div>
      <p class="wsum">Ticked items become yes/no questions in part B; “No” terminates.</p>`;
  }
  function stepCrit(st) {
    return `<div class="wopts">${st.crit.map(c => `<label class="wopt"><input type="checkbox" data-crit="${c.id}"${c.on ? " checked" : ""}>
      <span class="wico">${ic(CRIT_ICON[c.id] || "target")}</span><span><b>${esc(c.label)}</b><small>${esc(c.hint)}</small></span>${tick()}</label>`).join("")}</div>`;
  }
  function stepRanges(st) {
    const sel = st.crit.filter(c => c.on);
    if (!sel.length) return `<p class="none">No criteria picked. Go back a step to choose what matters.</p>`;
    return sel.map(c => {
      const r = st.R[c.id], head = `<header><span class="wico">${ic(CRIT_ICON[c.id] || "target")}</span><div><b>${esc(c.label)}</b><br><small>${esc(c.hint)}</small></div></header>`;
      if (NUM_RANGES[c.id]) {
        const [unit, L] = NUM_RANGES[c.id];
        return `<section class="wrange">${head}<div class="wrow">
          <label class="wf">Minimum (${unit})<input type="number" min="0" data-r="${c.id}.min" value="${r.min ?? ""}"></label>
          ${c.id === "dpc" ? "" : `<label class="wf">Maximum (${unit})<input type="number" min="0" data-r="${c.id}.max" value="${r.max ?? ""}" placeholder="No limit"></label>`}
          ${c.id === "volume" ? `<label class="wf">Counted over<select data-r="volume.win">${["in the past 3 months", "in the past 12 months", "in the past 3 years", "in the past 5 years"].map(w => `<option${w === r.win ? " selected" : ""}>${w}</option>`).join("")}</select></label>
            <label class="wf">Above the maximum<select data-r="volume.over"><option value="F"${r.over === "F" ? " selected" : ""}>Flag for review</option><option value="T"${r.over === "T" ? " selected" : ""}>Terminate</option></select></label>` : ""}
        </div><p class="wsum" data-rsum="${c.id}">${esc(rangeSum(c.id, r))}</p></section>`;
      }
      if (LIST_RANGES.includes(c.id)) {
        return `<section class="wrange">${head}<table class="wq"><thead><tr><th></th><th>Accept</th><th>Min %</th><th>Max %</th></tr></thead><tbody>
          ${r.opts.map(x => `<tr class="${x.on ? "" : "off"}"><td><input type="checkbox" data-r="${c.id}.${x.id}.on"${x.on ? " checked" : ""} aria-label="Accept ${esc(x.label)}"></td><td>${esc(x.label)}</td>
            <td><input type="number" min="0" max="100" data-r="${c.id}.${x.id}.min" value="${x.min ?? ""}" aria-label="${esc(x.label)} minimum %"></td>
            <td><input type="number" min="0" max="100" data-r="${c.id}.${x.id}.max" value="${x.max ?? ""}" aria-label="${esc(x.label)} maximum %"></td></tr>`).join("")}</tbody></table>
          <p class="wsum" data-rsum="${c.id}">${esc(rangeSum(c.id, r))}</p></section>`;
      }
      return `<section class="wrange">${head}<p class="wsum">No limits needed: answers are recorded${c.id === "treat" || c.id === "lived" ? " and used as quotas" : ""}.</p></section>`;
    }).join("");
  }
  function rangeSum(id, r) {
    if (NUM_RANGES[id]) {
      const u = NUM_RANGES[id][0];
      if (id === "dpc") return `Terminate below ${r.min ?? 0}${u}.`;
      return `${r.min ? `Terminate below ${fmt(r.min)} ${u}` : `No minimum`}${r.max != null ? `; ${id === "volume" && r.over === "F" ? "flag" : "terminate"} above ${fmt(r.max)}` : "; no maximum"}.`;
    }
    const acc = r.opts.filter(x => x.on), mins = acc.reduce((a, x) => a + (+x.min || 0), 0);
    return `${acc.length} accepted${r.opts.length > acc.length ? `, ${r.opts.length - acc.length} terminate` : ""} · minimum quotas add up to ${mins}%.`;
  }
  function stepBrief(st) {
    const B = st.B, P = st.P, T = topics(P, st.tg), PR = products(P);
    return `<div class="wrow"><label class="wf grow">Study name<input data-b="title" value="${esc(B.title)}"></label></div>
      <label class="wf wide" style="margin-top:10px">What do you want to learn?<textarea data-b="objective" placeholder="For example: how ${esc(roleTitle(st.tg).toLowerCase())}s choose between treatments for ${esc(P.name)} and what slows access">${esc(B.objective)}</textarea></label>
      <div class="wrow" style="margin-top:10px"><div class="wf">Method<span class="wseg" role="radiogroup" aria-label="Method">${Object.entries(METHODS).map(([k, m]) => `<label><input type="radio" name="wmethod" value="${k}"${k === B.method ? " checked" : ""}>${m.label}</label>`).join("")}</span></div>
        <label class="wf">Sample size (n)<input type="number" min="1" max="2000" data-b="n" value="${B.n}"></label>
        <label class="wf">Length (minutes)<input type="number" min="5" max="240" data-b="loi" value="${B.loi}"></label></div>
      <div class="wf wide" style="margin-top:12px">Topics to cover<div class="wchips">${T.map(t => `<label class="wc"><input type="checkbox" data-topic="${t.id}"${B.topics.includes(t.id) ? " checked" : ""}>${esc(t.label)}</label>`).join("")}</div></div>
      ${PR.length ? `<div class="wf wide" style="margin-top:12px">Products to ask about<div class="wchips">${PR.map(p => `<label class="wc"><input type="checkbox" data-prod="${esc(p.name)}"${B.products.includes(p.name) ? " checked" : ""}>${esc(p.name)}</label>`).join("")}</div></div>` : ""}
      <div class="wrow" style="margin-top:12px"><label class="wf grow">Other products (comma-separated)<input data-b="extra" value="${esc(B.extra)}" placeholder="Optional"></label>
        <label class="wf">Fieldwork dates<input data-b="timing" value="${esc(B.timing)}" placeholder="e.g. Jan 12–30"></label>
        <label class="wf">Incentive (US$)<input type="number" min="0" data-b="incentive" value="${esc(B.incentive)}"></label></div>
      <div class="wchips" style="margin-top:14px">${[["compliance", "US compliance block"], ["ae", "Adverse-event notice"], ["blinded", "Blinded sponsor"], ["video", "Video with camera on"]].map(([k, l]) => `<label class="wc"><input type="checkbox" data-bflag="${k}"${B[k] ? " checked" : ""}>${l}</label>`).join("")}</div>`;
  }
  const PREVIEW = {
    single: "<span><i></i>Option A</span><span><i></i>Option B</span>",
    multi: '<span><i class="sq"></i>Option A</span><span><i class="sq"></i>Option B</span>',
    matrix: '<span class="grid"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    field: '<span class="bar"></span>',
    scale: "<span>1 · 2 · 3 · 4 · 5</span>",
    rank: "<span>1. Option B</span><span>2. Option A</span>",
  };
  function stepTypes(st) {
    return `<div class="wtypes">${Object.entries(QTYPES).map(([k, [l, d]]) => `<label class="wopt"><input type="checkbox" data-qt="${k}"${st.T[k] ? " checked" : ""}>
      <span><b>${l}</b><small>${d}</small><span class="tpv">${PREVIEW[k]}</span></span>${tick()}</label>`).join("")}</div>
      <p class="wsum">Numbers (experience, volume, age) become a form field or answer bands; awareness of therapies becomes a matrix or a multiple choice; priorities become a ranking or a multiple choice.</p>`;
  }
  const tagSel = (tg, key) => `<select class="qtag ${tg}" data-k="${key}" aria-label="Logic">${Object.entries(TAGS).map(([k, v]) => `<option value="${k}"${k === tg ? " selected" : ""}>${v}</option>`).join("")}</select>`;
  function qBody(q) {
    const a = q.alts[q.type];
    const opts = L => `<ul class="qo">${L.map(([l, tg], i) => `<li><span class="ol" contenteditable="true" spellcheck="true" data-k="o:${i}">${esc(l)}</span>${tagSel(tg, "tag:" + i)}</li>`).join("")}</ul>`;
    if (q.type === "matrix") return `<div class="qmx"><table><thead><tr><th></th>${a.cols.map(([c, tg], i) => `<th><span contenteditable="true" data-k="c:${i}">${esc(c)}</span>${tagSel(tg, "ct:" + i)}</th>`).join("")}</tr></thead>
      <tbody>${a.rows.map((r, i) => `<tr><td contenteditable="true" data-k="r:${i}">${esc(r)}</td>${a.cols.map(() => "<td><i></i></td>").join("")}</tr>`).join("")}</tbody></table></div>`;
    if (q.type === "scale") return `<div class="qscale"><span contenteditable="true" data-k="lo">${esc(a.lo)}</span><span class="pts">${Array.from({ length: a.points }, (_, i) => `<i>${i + 1}</i>`).join("")}</span><span contenteditable="true" data-k="hi">${esc(a.hi)}</span></div>${opts(a.opts)}`;
    if (q.type === "field") return `<div class="qfield">${a.field.kind === "text" ? "Text box" : "Number" + (a.field.unit ? " · " + esc(a.field.unit) : "")}<i></i></div>${opts(a.opts)}`;
    return opts(a.opts);
  }
  function qHTML(q, si, qi) {
    if (q.type === "text") return `<li class="q text${q.inc ? "" : " off"}" data-s="${si}" data-i="${qi}"><div class="qh"><input type="checkbox" class="qinc"${q.inc ? " checked" : ""} aria-label="Include this text"><span class="qt" contenteditable="true" spellcheck="true" data-k="t">${esc(q.t)}</span></div></li>`;
    const types = Object.keys(q.alts);
    return `<li class="q${q.inc ? "" : " off"}" data-s="${si}" data-i="${qi}">
      <div class="qh"><input type="checkbox" class="qinc"${q.inc ? " checked" : ""} aria-label="Include ${q.id}"><span class="qn">${q.id}</span><span class="qt" contenteditable="true" spellcheck="true" data-k="t">${esc(q.t)}</span>
        ${types.length > 1 ? `<select class="qtype" data-k="type" aria-label="Question type for ${q.id}">${types.map(t => `<option value="${t}"${t === q.type ? " selected" : ""}>${QTYPES[t][0]}</option>`).join("")}</select>` : `<span class="qtype" title="Only this type fits">${QTYPES[q.type][0]}</span>`}</div>
      ${q.note ? `<div class="qs" contenteditable="true" spellcheck="true" data-k="note">${esc(q.note)}</div>` : ""}
      ${qBody(q)}
      ${q.src ? `<span class="qsrc">${ic("db")}${esc(q.src)}</span>` : ""}
    </li>`;
  }
  const termsHTML = S => { const L = terms(S); return L.length ? L.map(([id, t]) => `<li><b>${id}</b><span>${esc(t)}</span></li>`).join("") : "<li>No terminate answers selected.</li>"; };
  function stepReview(st) {
    const S = st.S, n = S.n;
    const chips = [S.target.name, `${S.method.label} · ${st.B.loi} min`, `n=${n}`, ...st.crit.filter(c => c.on).map(c => c.label)];
    return `<div class="rvsum">${chips.map(c => `<span>${esc(c)}</span>`).join("")}</div>
      <div class="legend-tags">${Object.entries(TAGS).map(([k, v]) => `<span class="logic ${k}" title="${esc(TAG_HELP[k])}">${v}</span>`).join("")}</div>
      ${S.sections.map((s, si) => `<div class="qsec">${esc(s.title)}</div><ol class="qlist">${s.items.map((q, qi) => qHTML(q, si, qi)).join("")}</ol>`).join("")}
      <div class="qsec">Quota plan · n=${n}</div>
      <table class="qtab"><thead><tr><th>Quota</th><th>Min %</th><th>Max %</th><th>Interviews</th></tr></thead><tbody>
        <tr><td>Total sample: ${esc(S.target.name)}</td><td>100</td><td>100</td><td>${n}</td></tr>
        ${S.quotas.map((x, i) => `<tr><td contenteditable="true" data-quota="${i}" data-qk="label">${esc(x.label)}</td><td><input type="number" min="0" max="100" data-quota="${i}" data-qk="min" value="${x.min ?? ""}" aria-label="Minimum %"></td>
          <td><input type="number" min="0" max="100" data-quota="${i}" data-qk="max" value="${x.max ?? ""}" aria-label="Maximum %"></td><td data-qn="${i}">${quotaN(x, n)}</td></tr>`).join("")}</tbody></table>
      <div class="qsec">Terminations</div><ul class="terms" id="wTerms">${termsHTML(S)}</ul>`;
  }
  const quotaN = (x, n) => `${x.min ? Math.ceil(n * x.min / 100) : 0}–${x.max != null ? Math.floor(n * x.max / 100) : n}`;
  const STEP_HTML = [stepWho, stepCerts, stepCrit, stepRanges, stepBrief, stepTypes, stepReview];

  /* problems that block "Next" */
  function check(st) {
    if (st.step === 3) {
      for (const c of st.crit.filter(c => c.on)) {
        const r = st.R[c.id];
        if (NUM_RANGES[c.id] && r.max != null && r.min != null && r.min > r.max) return `${c.label}: the minimum is above the maximum.`;
        if (LIST_RANGES.includes(c.id)) {
          const acc = r.opts.filter(x => x.on);
          if (!acc.length) return `${c.label}: accept at least one option.`;
          if (acc.reduce((a, x) => a + (+x.min || 0), 0) > 100) return `${c.label}: minimum quotas add up to more than 100%.`;
          const bad = acc.find(x => x.max != null && x.min != null && +x.min > +x.max);
          if (bad) return `${c.label}: ${bad.label} minimum is above its maximum.`;
        }
      }
    }
    if (st.step === 4 && !(st.B.n >= 1)) return "Enter a sample size of at least 1.";
    if (st.step === 5 && !Object.values(st.T).some(Boolean)) return "Allow at least one question type.";
    return "";
  }
  function footer(st) {
    const last = st.step === STEPS.length - 1;
    return `<button class="btn" type="button" data-w="back"${st.step ? "" : " disabled"}>${ic("arrow", "flip")}<span class="bl">Back</span></button><span class="wnote grow" role="status" id="wNote"></span>
      ${last ? `<button class="btn" type="button" data-x="copy">${ic("copy")}Copy</button><button class="btn" type="button" data-x="csv">${ic("download")}CSV</button>
        <button class="btn" type="button" data-x="ask">${ic("chat")}Tailor with assistant</button><button class="btn primary" type="button" data-x="docx">${ic("download")}Download Word</button>`
        : `<button class="btn primary" type="button" data-w="next">Next: ${STEPS[st.step + 1][0]}${ic("arrow")}</button>`}`;
  }

  /* ---------- text, CSV and Word ---------- */
  function numbered(S) {
    let n = 0;
    return S.sections.map(s => ({ title: s.title, items: s.items.filter(q => q.inc).map(q => q.type === "text" ? q : { ...q, id: "S" + (++n) }) })).filter(s => s.items.length);
  }
  const typeNote = q => q.type === "multi" ? "select all that apply" : q.type === "rank" ? `rank 1 to ${q.alts.rank.opts.length}` : q.type === "matrix" ? "one answer per row" : q.type === "scale" ? `1 to ${q.alts.scale.points}` : q.type === "field" ? (q.alts.field.field.kind === "text" ? "text entry" : `number${q.alts.field.field.unit ? ", " + q.alts.field.field.unit : ""}`) : "";
  const typeLabel = q => QTYPES[q.type][0] + (typeNote(q) ? ": " + typeNote(q) : "");
  function toText(S) {
    const B = S.W.B, L = [`RECRUITMENT SCREENER: ${S.title} (US)`, `${S.method.label} · ${B.loi} minutes · n=${S.n}${B.timing ? " · Fieldwork " + B.timing : ""}`, ""];
    if (B.objective) L.push("OBJECTIVE: " + B.objective, "");
    L.push("WHO QUALIFIES"); criteriaLines(S).forEach(([k, v]) => L.push(`- ${k}: ${v}`)); L.push("", "Logic: T = terminate · C = continue · Q = quota · R = record · F = flag for review", "");
    for (const s of numbered(S)) {
      L.push(s.title.toUpperCase());
      for (const q of s.items) {
        if (q.type === "text") { L.push(q.t, ""); continue; }
        const a = q.alts[q.type];
        L.push(`${q.id}. ${q.t} (${typeLabel(q)})`);
        if (q.note) L.push(`    Note: ${q.note}`);
        if (q.type === "matrix") { L.push("    Rows: " + a.rows.join(" | ")); a.cols.forEach((c, i) => L.push(`    ${i + 1}. ${c[0]}  [${TAGS[c[1]].toUpperCase()}]`)); }
        else {
          if (q.type === "scale") L.push(`    1 = ${a.lo} … ${a.points} = ${a.hi}`);
          a.opts.forEach((o, i) => L.push(`    ${q.type === "field" || q.type === "scale" ? "If " : `${i + 1}. `}${o[0]}  [${TAGS[o[1]].toUpperCase()}]`));
        }
        L.push("");
      }
    }
    L.push("QUOTA PLAN", `- Total sample: n=${S.n}`); S.quotas.forEach(x => L.push(`- ${x.label}: ${x.min ?? 0}%–${x.max ?? 100}% (${quotaN(x, S.n)} of ${S.n})`));
    const T = terms({ ...S, sections: numbered(S) });
    if (T.length) { L.push("", "TERMINATIONS"); T.forEach(([id, t]) => L.push(`- ${id}: ${t}`)); }
    return L.join("\n").trim() + "\n";
  }
  function toCSV(S) {
    const c = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Section", "Number", "Question", "Type", "Note", "Answer or row", "Logic"]];
    for (const s of numbered(S)) for (const q of s.items) {
      if (q.type === "text") { rows.push([s.title, "", q.t, "script", "", "", ""]); continue; }
      const a = q.alts[q.type], first = [s.title, q.id, q.t, QTYPES[q.type][0], q.note];
      const lines = q.type === "matrix" ? [...a.rows.map(r => ["Row: " + r, ""]), ...a.cols.map(cc => ["Column: " + cc[0], TAGS[cc[1]]])] : a.opts.map(o => [o[0], TAGS[o[1]]]);
      lines.forEach((l, i) => rows.push(i ? ["", "", "", "", "", ...l] : [...first, ...l]));
    }
    S.quotas.forEach(x => rows.push(["Quota plan", "", x.label, "quota", "", `${x.min ?? 0}%–${x.max ?? 100}%`, "Quota"]));
    return "﻿" + rows.map(r => r.map(c).join(",")).join("\r\n") + "\r\n";
  }

  /* minimal .docx writer (stored zip, no compression) with paragraphs and tables */
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
  function toDocx(S) {
    const x = s => String(s ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
    const COL = { T: "AE3527", C: "1D7650", Q: "1C4A96", R: "56667E", F: "9A6110" }, B = S.W.B;
    const run = (t, o = {}) => `<w:r><w:rPr><w:rFonts w:ascii="Helvetica" w:hAnsi="Helvetica" w:cs="Arial"/>${o.b ? "<w:b/>" : ""}${o.i ? "<w:i/>" : ""}${o.color ? `<w:color w:val="${o.color}"/>` : ""}<w:sz w:val="${o.sz || 20}"/></w:rPr><w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
    const para = (runs, o = {}) => `<w:p><w:pPr>${o.keep ? "<w:keepNext/>" : ""}<w:spacing w:before="${o.before ?? 0}" w:after="${o.after ?? 60}"/>${o.ind ? `<w:ind w:left="${o.ind}"/>` : ""}${o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="19376D"/></w:pBdr>' : ""}${o.align ? `<w:jc w:val="${o.align}"/>` : ""}</w:pPr>${runs}</w:p>`;
    const cell = (content, w, o = {}) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${o.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>` : ""}</w:tcPr>${content || para("")}</w:tc>`;
    const table = (rows, widths, o = {}) => `<w:tbl><w:tblPr><w:tblW w:w="${widths.reduce((a, b) => a + b, 0)}" w:type="dxa"/>${o.ind ? `<w:tblInd w:w="${o.ind}" w:type="dxa"/>` : ""}<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(s => `<w:${s} w:val="single" w:sz="4" w:space="0" w:color="C9D3E3"/>`).join("")}</w:tblBorders><w:tblCellMar><w:top w:w="50" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="50" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr>
      <w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${rows.map((r, ri) => `<w:tr><w:trPr><w:cantSplit/>${ri === 0 && o.head ? "<w:tblHeader/>" : ""}</w:trPr>${r.map((c, ci) => cell(typeof c === "string" ? para(run(c, { b: ri === 0 && o.head, sz: 18 }), { after: 0 }) : c.xml, widths[ci], { fill: ri === 0 && o.head ? "E8EEF8" : c.fill })).join("")}</w:tr>`).join("")}</w:tbl>${para("", { after: 120 })}`;
    const tagRun = tg => run(`   ${TAGS[tg].toUpperCase()}`, { b: true, sz: 16, color: COL[tg] });
    const h2 = t => para(run(t.toUpperCase(), { b: true, sz: 20, color: "19376D" }), { before: 240, after: 100, border: true, keep: true });
    const W10 = 10080;
    let body = para(run("Recruitment screener", { b: true, sz: 34, color: "0B2447" }), { after: 40 });
    body += para(run(`${S.title} (US)`, { b: true, sz: 26, color: "19376D" }), { after: 40 });
    body += para(run(`Drafted with Rare·Desk on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}. Verify credentials and quotas before fielding.`, { sz: 17, color: "56667E" }), { after: 160 });
    body += h2("Study brief");
    const brief = [["Study", B.title], ["Objective", B.objective || "Not entered"], ["Method", `${S.method.label} · ${B.loi} minutes`], ["Sample", `n=${S.n}`],
      ["Topics", topics(S.P, S.target).filter(t => B.topics.includes(t.id)).map(t => t.label).join("; ") || "None"],
      ["Products", [...B.products, ...String(B.extra || "").split(",").map(s => s.trim()).filter(Boolean)].join(", ") || "None"],
      ["Fieldwork", B.timing || "To be confirmed"], ["Incentive", B.incentive ? "$" + fmt(B.incentive) + " (fair market value)" : "To be confirmed"],
      ["Compliance", [B.compliance ? "US compliance block" : "", B.ae ? "adverse-event notice" : "", B.blinded ? "blinded sponsor" : "", B.video ? "video with camera on" : ""].filter(Boolean).join(", ") || "None"]];
    body += table(brief.map(([k, v]) => [{ xml: para(run(k, { b: true, sz: 18 }), { after: 0 }), fill: "F2F5FA" }, v]), [2200, W10 - 2200]);
    body += h2("Who qualifies");
    body += table(criteriaLines(S).map(([k, v]) => [{ xml: para(run(k, { b: true, sz: 18 }), { after: 0 }), fill: "F2F5FA" }, v]), [2600, W10 - 2600]);
    body += para(run("Logic: ", { b: true, sz: 18 }) + Object.entries(TAGS).map(([k, v]) => run(v + "   ", { b: true, sz: 18, color: COL[k] })).join(""), { before: 60, after: 120 });
    for (const s of numbered(S)) {
      body += h2(s.title);
      for (const q of s.items) {
        if (q.type === "text") { body += para(run(q.t, { i: true, sz: 19 }), { after: 120 }); continue; }
        const a = q.alts[q.type];
        body += para(run(q.id + ".  ", { b: true, color: "1C4A96" }) + run(q.t, { b: true }) + run(`  (${typeLabel(q)})`, { i: true, sz: 17, color: "56667E" }), { before: 140, after: 40, keep: true });
        if (q.note) body += para(run("Note: " + q.note, { i: true, sz: 17, color: "56667E" }), { ind: 400, after: 40, keep: true });
        if (q.type === "matrix") {
          const w0 = 3400, wc = Math.floor((W10 - 400 - w0) / a.cols.length);
          body += table([["", ...a.cols.map(c => ({ xml: para(run(c[0], { b: true, sz: 17 }), { after: 0, align: "center" }) + para(run(TAGS[c[1]].toUpperCase(), { b: true, sz: 14, color: COL[c[1]] }), { after: 0, align: "center" }), fill: "E8EEF8" }))],
            ...a.rows.map(r => [r, ...a.cols.map(() => ({ xml: para(run("○", { sz: 18, color: "56667E" }), { after: 0, align: "center" }) }))])], [w0, ...a.cols.map(() => wc)], { ind: 400, head: true });
          continue;
        }
        if (q.type === "field") body += para(run(a.field.kind === "text" ? "[Text entry]" : `[Number entry${a.field.unit ? ": " + a.field.unit : ""}${a.field.min != null && a.field.max != null ? `, accept ${fmt(a.field.min)}–${fmt(a.field.max)}` : ""}]`, { sz: 18, color: "56667E" }), { ind: 400, after: 40, keep: true });
        if (q.type === "scale") body += para(run(`Scale 1–${a.points}: 1 = ${a.lo}, ${a.points} = ${a.hi}`, { sz: 18, color: "56667E" }), { ind: 400, after: 40, keep: true });
        a.opts.forEach((o, i) => { body += para(run(q.type === "field" || q.type === "scale" ? `If ${o[0]}` : q.type === "rank" ? `__  ${o[0]}` : `${i + 1}.  ${o[0]}`) + tagRun(o[1]), { ind: 400, after: 20, keep: i < a.opts.length - 1 }); });
      }
    }
    body += h2("Quota plan");
    body += table([["Quota", "Min %", "Max %", "Interviews"], ["Total sample: " + S.target.name, "100", "100", String(S.n)],
      ...S.quotas.map(q => [q.label, q.min != null ? String(q.min) : "0", q.max != null ? String(q.max) : "100", quotaN(q, S.n)])], [5280, 1400, 1400, 2000], { head: true });
    const T = terms({ ...S, sections: numbered(S) });
    body += h2("Terminations");
    body += T.length ? T.map(([id, t]) => para(run(id + "  ", { b: true, color: "1C4A96", sz: 18 }) + run(t, { sz: 18 }), { ind: 200, after: 30 })).join("") : para(run("No terminate answers selected.", { sz: 18 }));
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
      try { await dl.save({ filename: name, data }); toast("Saved " + name); }
      catch (e) {
        const code = e && e.code;
        if (code === "declined") return;
        toast(code === "rate_limited" ? "A save prompt is already open" : "Downloads aren't available here. Use Copy instead.");
      }
      return;
    }
    if (window.claude) { toast("Downloads aren't available here. Use Copy instead."); return; }
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: mime }));
      a.download = name; document.body.append(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    } catch (_) { toast("Downloads are blocked here. Use Copy instead."); }
  }
  function copyBox(t) {
    let box = document.querySelector("#copyBox");
    if (!box) {
      box = document.createElement("div");
      box.id = "copyBox"; box.className = "copybox"; box.hidden = true;
      box.innerHTML = `<div class="copybox-panel" role="dialog" aria-modal="true" aria-labelledby="copyBoxTitle">
        <div class="copybox-head"><b id="copyBoxTitle">Copy the screener</b><button type="button" class="iconbtn" data-copyclose aria-label="Close">${ic("close")}</button></div>
        <p>The text is selected. Press Ctrl+C (⌘C on a Mac) to copy it.</p>
        <textarea id="copyBoxText" readonly aria-label="Screener text"></textarea></div>`;
      document.body.append(box);
      const close = () => { box.hidden = true; };
      box.addEventListener("click", e => { if (e.target === box || e.target.closest("[data-copyclose]")) close(); });
      box.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); } });
      box.addEventListener("copy", () => setTimeout(() => { close(); toast("Screener copied"); }, 0));
    }
    const ta = box.querySelector("textarea");
    ta.value = t; box.hidden = false; ta.focus(); ta.select();
  }
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); toast("Screener copied"); }
    catch (_) { copyBox(t); }
  }
  const fileBase = S => ("screener-" + S.P.key + "-" + S.target.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  /* ---------- mount: the Screener builder tab ---------- */
  function mount(P, el, arg) {
    if (!el || !P) return;
    downloadsCap();
    const list = targets(P);
    const st = { P, list, step: 0, S: null, ...defaults(P, pickTarget(list, arg)) };
    if (arg) st.step = 1;                       // came from the stakeholder map: the stakeholder is already chosen
    const $ = s => el.querySelector(s);
    const stale = () => { st.S = null; };
    const nav = () => { $(".wsteps").innerHTML = navHTML(st); };
    function draw(focusTitle) {
      if (st.step === STEPS.length - 1 && !st.S) st.S = build(P, st.tg, st);
      const [, h, sub] = STEPS[st.step];
      el.innerHTML = `<div class="wiz">
        <nav class="wsteps" aria-label="Screener steps">${navHTML(st)}</nav>
        <section class="cc wcard" aria-labelledby="wTitle">
          <header class="whead"><span class="eyebrow">Step ${st.step + 1} of ${STEPS.length} · ${esc(st.tg.name)}</span><h2 id="wTitle" tabindex="-1">${h}</h2><p>${sub}</p></header>
          <div class="wbody${focusTitle ? " enter" : ""}" id="wBody">${STEP_HTML[st.step](st)}</div>
          <footer class="wfoot">${footer(st)}</footer>
        </section></div>`;
      if (focusTitle) $("#wTitle").focus({ preventScroll: true });
    }
    const go = i => { st.step = Math.max(0, Math.min(STEPS.length - 1, i)); draw(true); };
    const note = t => { const n = $("#wNote"); if (n) n.textContent = t; };
    draw(false);

    el.addEventListener("click", e => {
      const t = e.target;
      const s = t.closest("[data-wstep]");
      if (s) { const i = +s.dataset.wstep; if (i > st.step && st.step >= 3) { const p = check(st); if (p) { note(p); return; } } go(i); return; }
      const w = t.closest("[data-w]");
      if (w) {
        if (w.dataset.w === "back") go(st.step - 1);
        else { const p = check(st); if (p) note(p); else go(st.step + 1); }
        return;
      }
      const x = t.closest("[data-x]");
      if (x && st.S) {
        const S = st.S, base = fileBase(S);
        if (x.dataset.x === "copy") copyText(toText(S));
        else if (x.dataset.x === "csv") saveFile(base + ".csv", toCSV(S), "text/csv");
        else if (x.dataset.x === "docx") saveFile(base + ".docx", new Blob([toDocx(S)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        else if (x.dataset.x === "ask") document.dispatchEvent(new CustomEvent("rd:chat-open", { detail: {
          prompt: `Review this draft screener for a ${S.target.name} (${P.name}, US). Suggest 3 disease-specific knowledge-check questions, flag weak termination logic, and tighten the quotas. Keep it short.`,
          context: { label: `Screener draft · ${S.target.name}`, text: toText(S) },
        } }));
      }
    });
    el.addEventListener("change", e => {
      const t = e.target, d = t.dataset;
      if (t.name === "wwho") { const tg = list.find(x => x.name === t.value); if (tg) { Object.assign(st, defaults(P, tg, st.B)); stale(); draw(false); el.querySelector(`[name="wwho"][value="${CSS.escape(tg.name)}"]`).focus(); } return; }
      if (d.cert) { const c = st.certs.find(c => c.id === d.cert); if (c) c.on = t.checked; stale(); $("#wBody").classList.remove("enter"); $("#wBody").innerHTML = stepCerts(st); nav(); $(`[data-cert="${d.cert}"]`).focus(); return; }
      if ("eligible" in d) { st.eligible = t.checked; stale(); return; }
      if (d.crit) { const c = st.crit.find(c => c.id === d.crit); if (c) c.on = t.checked; stale(); nav(); return; }
      if (d.topic) { st.B.topics = st.B.topics.filter(x => x !== d.topic).concat(t.checked ? [d.topic] : []); stale(); return; }
      if (d.prod) { st.B.products = st.B.products.filter(x => x !== d.prod).concat(t.checked ? [d.prod] : []); stale(); return; }
      if (d.bflag) { st.B[d.bflag] = t.checked; stale(); return; }
      if (t.name === "wmethod") {
        const m = METHODS[t.value]; Object.assign(st.B, { method: t.value, n: m.n, loi: m.loi, video: m.video }); stale(); nav();
        $('[data-b="n"]').value = m.n; $('[data-b="loi"]').value = m.loi; $('[data-bflag="video"]').checked = m.video;
        return;
      }
      if (d.qt) { st.T[d.qt] = t.checked; stale(); nav(); return; }
      if (d.r) { setRange(d.r, t); return; }
      /* review edits */
      const li = t.closest(".q");
      if (li && st.S) {
        const q = st.S.sections[+li.dataset.s].items[+li.dataset.i];
        if (t.classList.contains("qinc")) { q.inc = t.checked; li.classList.toggle("off", !t.checked); }
        else if (d.k === "type") { const si = li.dataset.s, qi = li.dataset.i; q.type = t.value; li.outerHTML = qHTML(q, +si, +qi); el.querySelector(`.q[data-s="${si}"][data-i="${qi}"] .qtype`).focus(); }
        else if (d.k && /^(tag|ct):/.test(d.k)) { setField(q, d.k, t.value); t.className = "qtag " + t.value; }
        $("#wTerms").innerHTML = termsHTML(st.S);
      }
      if (d.quota != null && st.S) quotaEdit(t);
    });
    el.addEventListener("input", e => {
      const t = e.target, d = t.dataset;
      if (d.b) { st.B[d.b] = t.type === "number" ? num(t.value) : t.value; if (d.b === "n" || d.b === "loi") nav(); stale(); return; }
      if (d.r && t.type === "number") { setRange(d.r, t); return; }
      const li = t.closest(".q");
      if (li && d.k && st.S && t.isContentEditable) setField(st.S.sections[+li.dataset.s].items[+li.dataset.i], d.k, t.textContent.trim());
      if (d.quota != null && st.S) quotaEdit(t);
    });
    el.addEventListener("keydown", e => {
      if (e.target.isContentEditable && (e.key === "Enter" || e.key === "Escape")) { e.preventDefault(); e.stopPropagation(); e.target.blur(); }
    });
    el.addEventListener("paste", e => {
      if (!e.target.isContentEditable) return;
      e.preventDefault();
      document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text").replace(/\s+/g, " "));
    });
    function setRange(path, t) {
      const [id, a, b] = path.split("."), r = st.R[id];
      if (b) { const x = r.opts.find(o => o.id === a); if (!x) return; if (b === "on") { x.on = t.checked; t.closest("tr").classList.toggle("off", !t.checked); } else x[b] = num(t.value); }
      else r[a] = t.tagName === "SELECT" ? t.value : num(t.value);
      stale();
      const sum = el.querySelector(`[data-rsum="${id}"]`); if (sum) sum.textContent = rangeSum(id, r);
      note("");
    }
    function quotaEdit(t) {
      const i = +t.dataset.quota, x = st.S.quotas[i]; if (!x) return;
      if (t.dataset.qk === "label") x.label = t.textContent.trim(); else x[t.dataset.qk] = num(t.value);
      const cellN = el.querySelector(`[data-qn="${i}"]`); if (cellN) cellN.textContent = quotaN(x, st.S.n);
    }
  }
  function setField(q, k, v) {
    const a = q.alts[q.type];
    if (k === "t") q.t = v; else if (k === "note") q.note = v;
    else if (k === "lo" || k === "hi") a[k] = v;
    else {
      const [f, i] = k.split(":");
      if (f === "o") a.opts[+i][0] = v; else if (f === "tag") a.opts[+i][1] = v;
      else if (f === "r") a.rows[+i] = v; else if (f === "c") a.cols[+i][0] = v; else if (f === "ct") a.cols[+i][1] = v;
    }
  }

  window.RDScreener = { mount, build, targets, defaults, toText, toCSV, toDocx, isTarget: (name, group) => !!kindOf(name, group), TAGS, QTYPES };
})();
