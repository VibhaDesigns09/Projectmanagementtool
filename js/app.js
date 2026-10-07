/* Rare·Desk app: search, US disease dashboard, detail drawer, directory. */
(function () {
  "use strict";

  /* ===================== ICONS (inline 24×24 stroke) ===================== */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2.4.6 4 2.3 4 5.2"/>',
    steth: '<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-3"/><circle cx="20" cy="11" r="2"/>',
    scan: '<path d="M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 12h10"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3M7.5 15h9"/>',
    micro: '<path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3H8v3"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.5 12h5l1.5-3 2 5 1.5-2h7"/>',
    pill: '<path d="m10.5 20.5 10-10a5 5 0 0 0-7-7l-10 10a5 5 0 0 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3Z"/>',
    scale: '<path d="M12 3v18M7 21h10M4 7h16M4 7l-3 7a3 3 0 0 0 6 0Z M20 7l-3 7a3 3 0 0 0 6 0Z"/>',
    coins: '<circle cx="8" cy="8" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.4 18.1M7 6h1v4"/>',
    hospital: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6M10 21v-3h4v3"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    wind: '<path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    cycle: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    dna: '<path d="M5 3c0 6 14 12 14 18M19 3c0 6-14 12-14 18M8 7h8M8 17h8"/>',
    bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 11v9M3 13h4M17 13h4M4 7l3 2M20 7l-3 2M4 20l3-2M20 20l-3-2M9.5 4l1.5 3M14.5 4 13 7"/>',
    play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2Z"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    grad: '<path d="M22 10 12 5 2 10l10 5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    layers: '<path d="M12 2 2 7l10 5 10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    device: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 6h4M9 11h6M9 15h6"/>',
    happy: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    neutral: '<circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/>',
    sad: '<circle cx="12" cy="12" r="10"/><path d="M16 16.5s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    drop: '<path d="M12 2.7 6.3 9a8 8 0 1 0 11.4 0Z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9Z"/>',
    bone: '<path d="M17 10c.7-.7 1.6-.7 2.5-.7a2.5 2.5 0 1 0-2.4-3.4A2.5 2.5 0 1 0 13.6 5c0 .9 0 1.8-.7 2.5L7.5 13c-.7.7-1.6.7-2.5.7a2.5 2.5 0 1 0 2.4 3.4 2.5 2.5 0 1 0 3.5 2.4c0-.9 0-1.8.7-2.5Z"/>',
    kidney: '<path d="M15 3c-4.5 0-9 3.5-9 9s4.5 9 9 9c2.5 0 3.5-1.7 2.6-3.6-.8-1.6-2.6-2.6-2.6-5.4s1.8-3.8 2.6-5.4C18.5 4.7 17.5 3 15 3Z"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-13-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 9 0 4 3 7 7 7Z"/>',
    liver: '<path d="M3 8c0-3 3-4 8-4s10 1 10 5-5 11-9 11C7 20 3 13 3 8Z"/><path d="M12 4v9"/>',
    siren: '<path d="M7 18v-6a5 5 0 0 1 10 0v6M5 21h14v-3H5ZM12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4"/>',
    surgery: '<path d="m3 21 8-8"/><path d="M11 13 20 4l1 1-9 9Z"/>',
    badge: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 16.5c.6-1.6 2-2.5 3.5-2.5s2.9.9 3.5 2.5M14 9h4M14 12h4M14 15h2"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2Z"/><path d="M9 4v14M15 6v14"/>',
    clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  };
  const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.target}</svg>`;
  document.querySelectorAll("[data-i]").forEach(el => { el.outerHTML = ic(el.dataset.i); });

  /* ===================== HELPERS ===================== */
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const slug = s => norm(s).replace(/ /g, "-");
  const ext = u => `href="${esc(u)}" target="_blank" rel="noopener"`;
  const US = window.US;
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 4) return 99;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
  }

  /* ===================== CATEGORIES ===================== */
  const CATS = {
    immuno: { l: "Immune deficiency", i: "shield" }, inflam: { l: "Autoinflammatory & rheumatic", i: "flame" },
    metabolic: { l: "Inherited metabolic", i: "flask" }, nmd: { l: "Neuromuscular", i: "activity" },
    neuro: { l: "Neurological & epilepsy", i: "zap" }, blood: { l: "Blood & bleeding", i: "drop" },
    lung: { l: "Lung", i: "wind" }, kidney: { l: "Kidney", i: "kidney" }, endo: { l: "Endocrine, bone & growth", i: "bone" },
    skin: { l: "Skin & connective tissue", i: "layers" }, heart: { l: "Heart & vascular", i: "heart" },
    liver: { l: "Liver & gut", i: "liver" }, eye: { l: "Eye", i: "eye" }, syndrome: { l: "Developmental syndromes", i: "dna" },
    onc: { l: "Rare tumors", i: "target" },
  };

  /* ===================== IN-DEPTH PROFILE: BRONCHIECTASIS (US) ===================== */
  const DIR = window.DIRECTORY || [];
  const JD = window.JOURNEY_DATA || {};
  DIR.unshift({
    n: "Bronchiectasis", a: ["NCFB", "non-CF bronchiectasis", "non-cystic fibrosis bronchiectasis", "brochiectasis"], c: "lung",
    icd: "J47.0 / J47.1 / J47.9", curated: true, age: "60s",
    g: "Post-infectious, idiopathic, NTM, immune deficiency, ABPA, PCD, alpha-1, COPD/asthma overlap",
    p: "~350,000–500,000 US adults diagnosed (estimates)", us: "~350,000–500,000 US adults diagnosed (estimates)",
    w: "Permanently widened airways trap mucus; infection and neutrophil inflammation keep damaging them (the \"vicious vortex\")",
    dx: "High-resolution CT plus symptoms; cause work-up incl. sputum AFB cultures for NTM, immunoglobulins, alpha-1",
    tx: "Airway clearance, pulmonary rehab, long-term macrolides, inhaled antibiotics (off-label in US), brensocatib",
    sp: ["Pulmonologist", "Infectious disease specialist", "Respiratory therapist", "Radiologist"],
    rx: [["Brensocatib (Brinsupri)", "Insmed", "A", "Oral DPP1 inhibitor; FDA Aug 2025, age 12+"],
      ["BI 1291583", "Boehringer Ingelheim", "3", "Cathepsin C inhibitor"],
      ["Benralizumab (MAHALE)", "AstraZeneca", "3", "Eosinophilic subtype"],
      ["Inhaled colistimethate (PROMIS)", "Zambon", "3", "Chronic Pseudomonas; ex-US-led program"],
      ["HSK31858", "Haisco Pharmaceutical", "2", "DPP1 inhibitor (China)"],
      ["Inhaled tobramycin / colistin", "Generic", "O", "Off-label for Pseudomonas"],
      ["Azithromycin (long-term)", "Generic", "O", "Off-label; exclude NTM first"]],
    o: ["COPD Foundation", "NTM Info & Research"],
    read: [["book", "Bronchiectasis overview", "NIH · NHLBI", "https://www.nhlbi.nih.gov/health/bronchiectasis"],
      ["book", "Bronchiectasis", "American Lung Association", "https://www.lung.org/lung-health-diseases/lung-disease-lookup/bronchiectasis"],
      ["db", "Bronchiectasis & NTM Research Registry", "COPD Foundation", "https://www.copdfoundation.org"],
      ["users", "Patient education on NTM & bronchiectasis", "NTM Info & Research", "https://www.ntminfo.org"],
      ["file", "ERS adult guideline (2017), widely used by US clinicians", "Eur Respir J", "https://doi.org/10.1183/13993003.00629-2017"],
      ["file", "Bronchiectasis seminar (2018)", "The Lancet", "https://doi.org/10.1016/S0140-6736(18)31767-7"],
      ["file", "ASPEN phase 3 trial of brensocatib", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=ASPEN+brensocatib+bronchiectasis"]],
    accessExtra: [["device", "Medicare DME policy", "Airway clearance vest (HFCWO) criteria", "Vest users", "Needs CT-confirmed disease and documented history such as exacerbations"]],
    beyond: [["target", "Point-of-care neutrophil elastase test", "ProAxsis", "Research use; flags airway inflammation early"],
      ["cpu", "AI CT airway analysis", "Academic groups, start-ups", "Faster, consistent CT diagnosis"],
      ["db", "Bronchiectasis & NTM Research Registry", "COPD Foundation (US)", "Real-world data, trial recruitment", "https://www.copdfoundation.org"]],
    coExtra: [["device", "Electromed", "Devices", "SmartVest airway clearance system (US)", ["Rehab & airway clearance access"]],
      ["device", "Baxter (Hillrom)", "Devices", "The Vest airway clearance system", ["Rehab & airway clearance access"]]],
  });
  JD["Bronchiectasis"] = {
    s: ["Symptoms|wind|Months–years|Daily wet cough, sputum;Repeated chest infections|2|Worried|“Just another chest cold?”|Symptoms normalized",
      "Primary care|steth|Often years|Antibiotic courses;Labeled asthma, COPD or bronchitis|1|Frustrated|“Nothing gets rid of it.”|Late CT and referral",
      "CT & pulmonology|scan|Weeks–months|HRCT confirms widened airways;Referral (CT may need prior auth)|3|Relieved|“Finally, a name for it.”|CT access, referral waits",
      "Cause work-up|micro|Weeks|Sputum incl. AFB cultures for NTM;Immunoglobulins, ABPA, alpha-1|2|Overwhelmed|“So many tests.”|Work-up often incomplete",
      "Ongoing care|activity|Lifelong|Airway clearance with RT/PT;Rehab, macrolides, brensocatib|3|Adjusting|“It's my routine now.”|Rehab coverage, prior auth, cost",
      "Flare-ups|alert|Recurring|14-day antibiotics;IV or home infusion if severe|1|Anxious|“Will I end up in the hospital?”|Slow access to treatment"],
    k: ["care|Primary care physician (PCP)|steth|SLS.SL|First contact; decides when to order CT and refer",
      "care|Pulmonologist|wind|.SLLLL|Confirms diagnosis, runs long-term care",
      "dx|Radiologist|scan|..L.S.|Reads HRCT; extent and pattern of disease",
      "dx|Clinical microbiology lab|flask|.SSL.L|Sputum culture incl. AFB for NTM and Pseudomonas",
      "care|Infectious disease specialist|bug|...LSS|Treats NTM co-infection",
      "care|Allergist / immunologist|shield|...L..|Immune deficiency, ABPA",
      "care|Respiratory therapist|activity|....LS|Airway clearance training, pulmonary rehab",
      "care|Pharmacist / specialty pharmacy|pill|.S..LS|Brensocatib, nebulized antibiotics, macrolide safety",
      "care|Home infusion nurse|heart|.....L|IV antibiotics for severe flares",
      "sys|Payers (Medicare Part D, commercial PBMs)|coins|..S.LS|Prior auth for CT, brensocatib and vests",
      "sys|DME suppliers|device|....L.|Airway clearance vests, nebulizers",
      "sys|Insmed|building|S...LS|Brensocatib, disease awareness",
      "sys|COPD Foundation, NTM Info & Research|users|S.S.SL|Registry, education, advocacy"],
    gp: ["clock|Diagnostic delay|Years labeled asthma or COPD before a CT|h|Primary care;Radiology",
      "bug|NTM under-tested|AFB cultures often skipped while NTM rises in older US women|h|Pulmonologists;Labs",
      "micro|Incomplete cause work-up|Treatable causes (immune deficiency, ABPA, alpha-1) missed|h|Pulmonologists",
      "pill|Few FDA-approved drugs|Brensocatib is the only one; inhaled antibiotics are off-label|h|Pharma;FDA",
      "coins|Payer friction|Prior auth, exacerbation-count criteria and Part D costs slow brensocatib uptake|h|Payers;PBMs",
      "activity|Rehab & airway clearance access|Pulmonary rehab coverage is inconsistent outside COPD; few RT-led programs|m|Health systems;CMS",
      "layers|One-size-fits-all care|Neutrophilic vs eosinophilic disease and Pseudomonas status need different care|m|Researchers",
      "pin|Rural access|Bronchiectasis/NTM expertise sits in academic centers|l|Health systems"],
  };

  /* ===================== PROFILES ===================== */
  const STATUS = {
    A: { label: "FDA approved", short: "Approved", step: 4 }, F: { label: "Under FDA review", short: "In review", step: 3 }, "3": { label: "Phase 3", short: "Phase 3", step: 2 },
    "2": { label: "Phase 2", short: "Phase 2", step: 1 }, "1": { label: "Early clinical", short: "Early", step: 1 }, X: { label: "Approved outside US only", short: "Ex-US only", step: 0 },
    O: { label: "Off-label use in US", short: "Off-label", step: 0 },
  };
  const ORDER = { A: 0, F: 1, "3": 2, "2": 3, "1": 4, X: 5, O: 6 };
  const SEV = { h: "high", m: "med", l: "low" };
  const SEV_RANK = { high: 0, med: 1, low: 2 };
  const NONCO = /centers|^various$|^generic$|consortia|academic|transplant|^stem cell/i;
  const PRO_ORGS = /american academy of|optometric association|college of/i;

  function parseJourney(J) {
    if (!J) return null;
    const stages = J.s.map(x => { const [n, i, t, d, f, w, q, p] = x.split("|"); return { n, i, t, d: d.split(";"), f: +f, w, q, p }; });
    const rows = J.k.map(x => x.split("|"));
    const stakeholders = rows.some(r => r[0] === "patient") ? rows : [["patient", "Patient & family", "user", "L".repeat(stages.length), "Lives every stage"], ...rows];
    const gaps = J.gp.map(x => { const [i, t, d, s, o] = x.split("|"); return [i, t, d, SEV[s] || "med", (o || "").split(";").filter(Boolean)]; });
    return { stages, stakeholders, gaps };
  }

  const GENERIC = {
    stages: [
      { n: "Symptoms", i: "activity", t: "Months–years", d: ["Symptoms appear", "Vague or on-and-off"], f: 2, w: "Worried", q: "“Something's wrong.”", p: "Symptoms dismissed" },
      { n: "Primary care", i: "steth", t: "Often years", d: ["Common causes ruled out", "Treated as something else"], f: 1, w: "Frustrated", q: "“Nobody connects the dots.”", p: "Misdiagnosis, late referral" },
      { n: "Specialist", i: "hospital", t: "Weeks–months", d: ["Specialist review", "Rare disease suspected"], f: 3, w: "Hopeful", q: "“Finally, an expert.”", p: "Waits and travel" },
      { n: "Diagnosis", i: "scan", t: "Weeks", d: ["Confirmatory tests", "Disease named"], f: 3, w: "Relieved", q: "“It has a name.”", p: "Tests not available locally" },
      { n: "Treatment", i: "pill", t: "Months", d: ["Therapy started", "Prior authorization"], f: 3, w: "Cautious", q: "“Will this work for me?”", p: "Cost & prior authorization" },
      { n: "Long-term care", i: "heart", t: "Lifelong", d: ["Monitoring, flares", "Living with the disease"], f: 3, w: "Adjusting", q: "“Learning to live with it.”", p: "Fragmented care" }],
    stakeholders: [["patient", "Patient & family", "user", "LLLLLL", "Lives every stage"],
      ["care", "Primary care physician (PCP)", "steth", "LLS.SS", "First contact; decides when to refer"],
      ["care", "Specialist", "hospital", ".SLLLL", "Confirms diagnosis, leads treatment"],
      ["sys", "Payers & PBMs", "coins", "....LS", "Approve and fund therapy"],
      ["sys", "Patient organizations", "users", "S.S.SL", "Information, peer support, advocacy"]],
    gaps: [["clock", "Diagnostic delay", "Years before the right diagnosis", "high", ["Primary care"]]],
  };

  function buildProfile(e) {
    const cat = CATS[e.c] || { l: "Rare disease", i: "target" };
    const J = parseJourney(JD[e.n]);
    const base = J || GENERIC;
    const enc = encodeURIComponent(e.n);
    const pipeline = (e.rx || []).slice().sort((a, b) => ORDER[a[2]] - ORDER[b[2]]);
    const approved = pipeline.filter(r => r[2] === "A");
    const genetic = /metabolic|nmd|neuro|endo|skin|eye|syndrome|immuno/.test(e.c) || /gene|autosomal|x-linked|mutation|deletion|repeat/i.test(e.g || "");

    const read = e.read || [
      ["book", "Patient overview", "NIH GARD", "https://rarediseases.info.nih.gov/search?term=" + enc],
      ["book", "Health topic search", "MedlinePlus (NIH)", "https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&v%3Asources=medlineplus-bundle&query=" + enc],
      ["users", "Rare disease report", "NORD", "https://rarediseases.org/?s=" + enc],
      ...(genetic ? [["dna", "Clinical genetics review", "GeneReviews (NIH)", "https://www.ncbi.nlm.nih.gov/books/NBK1116/?term=" + enc]] : []),
      ["book", "Disease summary", "Orphanet", "https://www.orpha.net/en/disease/search?search=" + enc],
      ["file", "Latest reviews", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + enc + "&filter=pubt.review&sort=date"],
      ["file", "Guidelines", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + enc + "&filter=pubt.guideline"]];
    const watch = [[e.n + " explained", "YouTube", "https://www.youtube.com/results?search_query=" + enc + "+explained"],
      ["Patient & family stories", "YouTube", "https://www.youtube.com/results?search_query=" + enc + "+patient+story"],
      ["Treatment & research updates", "YouTube", "https://www.youtube.com/results?search_query=" + enc + "+treatment+update"],
      ["Grand rounds & conference talks", "YouTube", "https://www.youtube.com/results?search_query=" + enc + "+grand+rounds"]];

    const cos = new Map();
    for (const [drug, cs, st] of pipeline) for (let c of String(cs).split(" · ")) {
      c = c.replace(/ and biosimilars$| and others$/, "").trim();
      if (!c || NONCO.test(c)) continue;
      const m = cos.get(c) || { drugs: [], best: "1" };
      m.drugs.push(drug.replace(/ \(.*\)$/, ""));
      if (ORDER[st] < ORDER[m.best]) m.best = st;
      cos.set(c, m);
    }
    const coType = { A: "FDA-approved therapy", F: "Under FDA review", "3": "In clinical trials", "2": "In clinical trials", "1": "In clinical trials", X: "Approved outside the US", O: "Off-label use" };
    const companies = [...cos].map(([c, m]) => ["building", c, coType[m.best], m.drugs.length + " product" + (m.drugs.length > 1 ? "s" : "") + " listed", m.drugs.slice(0, 3)]);
    for (const x of e.coExtra || []) companies.push(x);
    for (const o of e.o || []) companies.push(["users", o, PRO_ORGS.test(o) ? "Professional society" : o === "NORD" ? "Umbrella patient organization" : "Patient organization", "Education, support, advocacy", []]);

    const gaps = base.gaps.slice().sort((a, b) => SEV_RANK[a[3]] - SEV_RANK[b[3]]);
    const P = {
      key: slug(e.n), name: e.n, cat: e.c, catLabel: cat.l, catIcon: cat.i, curated: !!e.curated, specific: !!J,
      aka: (e.a || []).filter(x => !/^brochi/i.test(x)).join(" · "), icd: e.icd || "", ageHint: e.age || "",
      what: e.w, cause: e.g, dx: e.dx, tx: e.tx, prevalence: e.p, specialists: e.sp || [],
      quick: [[cat.i, "What it is", e.w], ["dna", "Cause", e.g], ["users", "How common", e.p], ["scan", "Diagnosis", e.dx], ["pill", "Treatment", e.tx], ["steth", "Specialists", (e.sp || []).join(" · ")]],
      read, watch, stages: base.stages, stakeholders: base.stakeholders, pipeline, approved, gaps, companies,
      orgs: e.o || [],
      beyond: e.beyond || [
        ["flask", "Recruiting US trials", "ClinicalTrials.gov", "Active studies with US sites", "https://clinicaltrials.gov/search?cond=" + enc + "&country=United%20States&aggFilters=status:rec"],
        ["db", "Patient registries", "Web search", "Real-world and natural-history data", "https://www.google.com/search?q=" + enc + "+patient+registry+United+States"],
        ["bulb", "Research news", "PubMed · last 2 yrs", "Newest publications", "https://pubmed.ncbi.nlm.nih.gov/?term=" + enc + "&filter=datesearch.y_2"]],
    };
    P.est = US.estimate(e);
    P.orphan = US.orphanStatus(e, P.est);
    P.nbs = US.nbs(e.n);
    const acc = US.access(P);
    P.access = acc.rows.concat(e.accessExtra || []);
    P.facts = acc.facts; P.age = acc.age; P.payer = US.payerFocus(P, acc.kidney);
    P.networks = US.networks(e.n, e.c, acc.gene);
    P.reality = gaps.filter(g => g[3] !== "low").slice(0, 4).map(g => g[1] + ": " + g[2].charAt(0).toLowerCase() + g[2].slice(1));
    return P;
  }

  /* ===================== SEARCH INDEX ===================== */
  const INDEX = DIR.map((e, i) => ({ key: i, name: e.n, cat: e.c, terms: [e.n, ...(e.a || [])].map(norm) }));
  function score(item, n) {
    let best = 0;
    for (const t of item.terms) {
      if (t === n) return 100;
      const words = t.split(" ");
      if (t.startsWith(n) && n.length >= 2) best = Math.max(best, n.length >= 4 ? 85 : 75);
      else if (words.some(w => w.startsWith(n)) && n.length >= 3) best = Math.max(best, 70);
      else if (n.length >= 5 && t.includes(n)) best = Math.max(best, 62);
      else if (t.length >= 4 && (" " + n + " ").includes(" " + t + " ")) best = Math.max(best, 72);
      if (best < 60 && t.length > 4 && n.length > 4) { const d = lev(n, t); if (d <= Math.max(2, Math.floor(t.length * .25))) best = Math.max(best, 50 - d); }
    }
    return best;
  }
  function rank(q) {
    const n = norm(q); if (!n) return [];
    return INDEX.map(it => ({ it, s: score(it, n) })).filter(x => x.s >= 40).sort((a, b) => b.s - a.s || a.it.name.localeCompare(b.it.name));
  }

  /* ===================== STATE & ROUTING ===================== */
  let CUR = null;          // current profile
  let lastFocus = null;
  function setHash(h) { try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (_) { /* sandboxed */ } }
  function showPage() { $("#home").hidden = true; $("#page").hidden = false; document.body.classList.remove("is-home"); window.scrollTo(0, 0); }
  function showHome() {
    closeDrawer(); CUR = null; $("#page").hidden = true; $("#home").hidden = false; document.body.classList.add("is-home");
    $("#homeQ").value = ""; setHash(""); emit();
  }
  function emit() { document.dispatchEvent(new CustomEvent("rd:profile", { detail: CUR })); }

  function go(q) {
    q = (q || "").trim(); if (!q) return;
    const r = rank(q);
    if (!r.length) { CUR = null; showPage(); $("#topQ").value = q; $("#page").innerHTML = renderGeneric(q); setHash(""); emit(); return; }
    const top = r[0].it, also = r.slice(1).filter(x => x.s >= 60).slice(0, 6).map(x => x.it);
    openItem(top.key, top.terms.includes(norm(q)) ? null : q, also);
  }
  function openItem(key, typed = null, also = []) {
    const e = DIR[+key]; if (!e) return;
    closeDrawer();
    CUR = buildProfile(e);
    showPage(); $("#topQ").value = "";
    $("#page").innerHTML = renderDashboard(CUR, typed, also);
    setHash(CUR.key);
    emit();
  }

  /* ===================== DASHBOARD ===================== */
  const FEEL = f => f >= 4 ? ["happy", "var(--good)"] : f === 3 ? ["neutral", "var(--mid)"] : ["sad", "var(--bad)"];
  const counts = P => {
    const c = { A: 0, F: 0, "3": 0, early: 0, X: 0, O: 0 };
    for (const r of P.pipeline) { if (r[2] === "2" || r[2] === "1") c.early++; else c[r[2]]++; }
    return c;
  };
  function leads(P) {
    return P.stakeholders.filter(r => r[0] === "care" || r[0] === "dx")
      .map((r, i) => ({ r, i, L: (r[3].match(/L/g) || []).length }))
      .sort((a, b) => b.L - a.L || a.i - b.i).map(x => x.r);
  }
  function card(id, size, icon, title, count, body, moreLabel) {
    return `<article class="card ${size}" data-tab="${id}">
      <header>${ic(icon)}<h2>${title}</h2>${count ? `<span class="count">${count}</span>` : ""}</header>
      ${body}
      <button class="more" type="button" data-tab="${id}">${moreLabel} ${ic("chev")}</button>
    </article>`;
  }
  function miniJourney(P) {
    const S = P.stages, n = S.length, x = i => (i + .5) / n * 100, y = f => (5 - f) / 4 * 100;
    const pts = S.map((s, i) => `${x(i)},${y(s.f)}`).join(" ");
    return `<div class="minij" aria-label="Patient feeling across ${n} journey stages">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" x2="100" y1="50" y2="50" stroke="var(--line)" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>
        <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
      </svg>
      ${S.map((s, i) => `<span class="pt" title="${esc(s.n)}: ${esc(s.w)}" style="left:${x(i)}%;top:calc(10px + (100% - 28px) * ${y(s.f) / 100});background:${FEEL(s.f)[1]}"></span><span class="lbl" style="left:${x(i)}%">${esc(s.n)}</span>`).join("")}
    </div>`;
  }
  function metaChips(P) {
    const c = counts(P), out = [];
    out.push(`<span class="meta">${ic(P.catIcon)}${esc(P.catLabel)}</span>`);
    if (P.icd) out.push(`<span class="meta" title="US diagnosis code family; confirm the billable code">ICD-10-CM <b>${esc(P.icd)}</b></span>`);
    if (P.est) out.push(`<span class="meta" title="${P.est.source === "calc" ? "Calculated from the prevalence or incidence rate × US population/births" : "Published US estimate"}">${ic("users")}<b>${esc(P.est.text)}</b></span>`);
    if (P.orphan) out.push(`<span class="meta ${P.orphan.level === "rare" ? "good" : "warn"}">${esc(P.orphan.text)}</span>`);
    out.push(c.A ? `<span class="meta good">${ic("check")}<b>${c.A}</b> FDA-approved</span>` : `<span class="meta bad">${ic("alert")}No FDA-approved therapy</span>`);
    if (c.F) out.push(`<span class="meta">${ic("clock")}<b>${c.F}</b> under FDA review</span>`);
    if (P.nbs.level !== "none") out.push(`<span class="meta ${P.nbs.level === "core" ? "good" : "warn"}">${ic("target")}${esc(P.nbs.text)}</span>`);
    return out.join("");
  }

  function renderDashboard(P, typed, also) {
    const c = counts(P);
    const lead = leads(P);
    const lowest = P.stages.reduce((m, s) => s.f < m.f ? s : m, P.stages[0]);
    const top3 = P.pipeline.slice(0, 3);
    const chips = P.companies.slice(0, 7);
    return `
    ${typed ? `<div class="notice">${ic("search")}Showing <b>${esc(P.name)}</b> for “${esc(typed)}”</div>` : ""}
    <div class="dhead">
      <div><div class="eyebrow">${P.curated ? "In-depth profile" : "Directory profile"} · US</div><h1>${esc(P.name)}</h1>${P.aka ? `<div class="aka">${esc(P.aka)}</div>` : ""}</div>
      <div class="dactions">
        <button class="btn primary" type="button" data-act="chat">${ic("chat")}Ask the assistant</button>
        <button class="btn" type="button" data-tab="screener">${ic("clipboard")}Screener builder</button>
        <button class="btn" type="button" data-tab="certs">${ic("badge")}Certifications</button>
      </div>
      <div class="metas">${metaChips(P)}</div>
    </div>
    ${also.length ? `<div class="also"><span class="eyebrow">Also matching</span>${also.map(it => `<button class="chip" type="button" data-open="${it.key}">${esc(it.name)}</button>`).join("")}</div>` : ""}
    <div class="dash">
      ${card("about", "s4", "book", "About the disease", "", `
        <p class="lede">${esc(P.what)}</p>
        <dl class="facts"><dt>Cause</dt><dd title="${esc(P.cause)}">${esc(P.cause)}</dd><dt>Diagnosis</dt><dd title="${esc(P.dx)}">${esc(P.dx)}</dd><dt>Treatment</dt><dd title="${esc(P.tx)}">${esc(P.tx)}</dd></dl>`,
        `${P.read.length} sources & ${P.watch.length} videos`)}
      ${card("journey", "s5", "route", "Patient journey", `${P.stages.length} stages`, `
        ${miniJourney(P)}
        <div class="painline">${ic("alert")}<span>Hardest point: <b>${esc(lowest.n)}</b> · ${esc(lowest.p)}</span></div>`,
        "Open journey & stakeholder map")}
      ${card("stakeholders", "s3", "users", "Stakeholders", `${P.stakeholders.length}`, `
        <ul class="rows">${lead.slice(0, 6).map(r => `<li class="g-${r[0]}">${ic(r[2])}<span title="${esc(r[4])}">${esc(r[1])}</span></li>`).join("")}</ul>`,
        "Who leads at each stage")}
      ${card("access", "s3", "coins", "US access & payers", "", `
        <ul class="rows">
          <li>${ic("landmark")}<span class="${c.A ? "ok" : "warn"}">${c.A ? `FDA: ${c.A} approved` : "FDA: none approved"}${c.F ? ` · ${c.F} in review` : ""}</span></li>
          <li>${ic("users")}<span title="${esc(P.payer[1])}">Payer focus: <b>${esc(P.payer[0])}</b></span></li>
          <li>${ic("hospital")}<span title="${esc(P.networks[0][1])}">${esc(P.networks[0][0])}</span></li>
          ${P.nbs.level !== "none" ? `<li>${ic("target")}<span title="${esc(P.nbs.text)}">${esc(P.nbs.text)}</span></li>` : `<li>${ic("scale")}<span>ICER may review high-cost drugs</span></li>`}
        </ul>`, "Who influences access")}
      ${card("pipeline", "s3", "pill", "Therapies & pipeline", "", `
        <div class="statrow">
          <div class="stat ok"><b>${c.A}</b><span>Approved</span></div><div class="stat"><b>${c.F}</b><span>At FDA</span></div>
          <div class="stat"><b>${c["3"]}</b><span>Phase 3</span></div><div class="stat"><b>${c.early}</b><span>Earlier</span></div>
        </div>
        ${top3.length ? `<ul class="rows">${top3.map(r => `<li><span title="${esc(r[0])} · ${esc(r[1])} · ${esc(STATUS[r[2]].label)}">${esc(r[0])}</span><span class="pill ${esc(r[2])}">${esc(STATUS[r[2]].short)}</span></li>`).join("")}</ul>` : `<p class="lede">No approved or late-stage therapy listed yet.</p>`}`,
        "Full pipeline")}
      ${card("gaps", "s3", "alert", "Gaps people talk about", `${P.gaps.length}`, `
        <ul class="rows">${P.gaps.slice(0, 5).map(g => `<li><span class="dot sev-${g[3]}"></span><span title="${esc(g[1])}: ${esc(g[2])}"><b>${esc(g[1])}</b></span></li>`).join("")}</ul>`,
        `All ${P.gaps.length} gaps & owners`)}
      ${card("companies", "s3", "building", "Companies & organizations", `${P.companies.length}`, `
        <div class="chipset">${chips.map(x => `<span class="tag" title="${esc(x[2])}">${ic(x[0])}${esc(x[1])}</span>`).join("")}${P.companies.length > chips.length ? `<span class="tag">+${P.companies.length - chips.length} more</span>` : ""}</div>`,
        "Who works on the gaps")}
    </div>
    <p class="foot">${ic("clock")}Reviewed October 2026 · US data (FDA, CMS, RUSP). Approval status changes fast; verify before citing. Not medical advice.</p>`;
  }

  /* ===================== DRAWER ===================== */
  const TABS = [["about", "About"], ["journey", "Journey map"], ["stakeholders", "Stakeholders"], ["access", "US access"],
    ["pipeline", "Pipeline"], ["gaps", "Gaps"], ["companies", "Companies"], ["screener", "Screener builder"], ["certs", "Certifications"]];
  let curTab = null;
  function openTab(tab, arg) {
    if (!CUR) return;
    const d = $("#drawer");
    if (d.hidden) { lastFocus = document.activeElement; d.hidden = false; document.documentElement.style.overflow = "hidden"; }
    curTab = tab;
    $("#drawerEyebrow").textContent = CUR.catLabel;
    $("#drawerTitle").textContent = CUR.name;
    $("#tabs").innerHTML = TABS.map(([id, l]) => `<button class="tab" type="button" role="tab" data-dtab="${id}" aria-selected="${id === tab}">${l}</button>`).join("");
    const body = $("#drawerBody");
    body.scrollTop = 0;
    body.innerHTML = (RENDER[tab] || RENDER.about)(CUR, arg);
    if (tab === "screener" && window.RDScreener) window.RDScreener.mount(CUR, body.querySelector("#screenerMount"), arg);
    if (tab === "certs" && arg) {
      const el = body.querySelector(`[data-certname="${CSS.escape(arg)}"]`);
      if (el) { el.scrollIntoView({ block: "start" }); el.classList.add("flash"); }
    }
    const sel = $("#tabs").querySelector('[aria-selected="true"]');
    sel?.scrollIntoView({ inline: "nearest", block: "nearest" });
    (d.contains(document.activeElement) ? sel : d.querySelector("[data-close].iconbtn"))?.focus();
  }
  function closeDrawer() {
    const d = $("#drawer"); if (d.hidden) return;
    d.hidden = true; document.documentElement.style.overflow = ""; curTab = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function journeyMap(P) {
    const S = P.stages, n = S.length, pct = i => ((i + .5) / n * 100), y = f => (5 - f) / 4 * 100;
    const pts = S.map((s, i) => `${pct(i)},${y(s.f)}`).join(" ");
    const groups = { patient: "Patient", care: "Care team", dx: "Diagnostics & specialists", sys: "System & industry" };
    const order = { patient: 0, care: 1, dx: 2, sys: 3 };
    let rows = "", last = null;
    for (const [g, name, icon, map, role] of [...P.stakeholders].sort((a, b) => order[a[0]] - order[b[0]])) {
      if (g !== last) { rows += `<div class="grp g-${g}">${groups[g]}${last === null ? `<span class="legend"><span><i class="mk L lg g-${g}"></i>Leads</span><span><i class="mk S lg g-${g}"></i>Supports</span></span>` : ""}</div>`; last = g; }
      const on = [...map].map(c => c !== "."), first = on.indexOf(true), lastOn = on.lastIndexOf(true);
      rows += `<div class="rl who g-${g}" title="${esc(role)}">${ic(icon)}<span>${esc(name)}</span>${g !== "patient" ? `<button class="cert" type="button" data-cert="${esc(name)}" aria-label="US credentials for ${esc(name)}" title="US credentials">${ic("badge")}</button>` : ""}</div>`;
      rows += [...map].map((c, i) => {
        const cls = (i < first || i > lastOn) ? "none" : (i === first ? "edge-l" : "") + (i === lastOn ? " edge-r" : "");
        return `<div class="cell g-${g} ${cls}">${c === "." ? "" : `<span class="mk ${c}" title="${esc(name)} ${c === "L" ? "leads" : "supports"} at ${esc(S[i].n)}"></span>`}</div>`;
      }).join("");
    }
    return `<div class="jwrap"><div class="jm" style="--cols:${n}">
      <div class="rl">${ic("route")}Stage</div>
      ${S.map(s => `<div class="stage"><span class="ico">${ic(s.i)}</span><b>${esc(s.n)}</b><span class="time">${ic("clock")}${esc(s.t)}</span></div>`).join("")}
      <div class="rl">${ic("file")}What happens</div>
      ${S.map(s => `<div><ul>${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
      <div class="rl">${ic("heart")}Patient feels</div>
      <div class="feel">
        <span class="band" style="top:4px">better</span><span class="band" style="bottom:62px">worse</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" x2="100" y1="50" y2="50" stroke="var(--line)" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>
          <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
        </svg>
        ${S.map((s, i) => { const [f, c] = FEEL(s.f); return `<div class="fdot" style="left:${pct(i)}%;top:calc(24px + (100% - 104px) * ${y(s.f) / 100});--fc:${c}"><span class="face">${ic(f)}</span><b>${esc(s.w)}</b></div><div class="quote" style="left:${pct(i)}%">${esc(s.q)}</div>`; }).join("")}
      </div>
      <div class="rl">${ic("alert")}Pain point</div>
      ${S.map(s => `<div class="pain">${ic("alert")}<span>${esc(s.p)}</span></div>`).join("")}
      ${rows}
    </div></div>`;
  }

  const stageList = (P, map, ch) => [...map].map((c, i) => c === ch ? P.stages[i].n : null).filter(Boolean);
  function certTargets(P) {
    const seen = new Set(), out = [];
    for (const [g, name, icon, map, role] of P.stakeholders) {
      if (g === "patient" || seen.has(name)) continue;
      seen.add(name); out.push({ g, name, icon, role, map });
    }
    for (const s of P.specialists) if (!seen.has(s)) { seen.add(s); out.push({ g: "care", name: s, icon: "steth", role: "Specialist for this disease", map: "" }); }
    return out;
  }

  const RENDER = {
    about(P) {
      return `
      <div class="dsec"><h3>${ic("book")}Key facts</h3>
        <div class="grid2">${P.quick.map(([i, k, v]) => `<div class="box tile"><span class="ico">${ic(i)}</span><div><strong>${esc(k)}</strong>${esc(v)}</div></div>`).join("")}</div></div>
      <div class="dsec"><h3>${ic("landmark")}US snapshot</h3>
        <div class="box"><dl class="kv">
          ${P.icd ? `<dt>ICD-10-CM</dt><dd>${esc(P.icd)} <small style="color:var(--muted)">(confirm the billable code)</small></dd>` : ""}
          <dt>US estimate</dt><dd>${P.est ? esc(P.est.text) + (P.est.source === "calc" ? ` <small style="color:var(--muted)">calculated from: ${esc(P.prevalence)}</small>` : "") : esc(P.prevalence)}</dd>
          ${P.orphan ? `<dt>Orphan status</dt><dd>${esc(P.orphan.text)}</dd>` : ""}
          <dt>Newborn screening</dt><dd>${esc(P.nbs.text)}</dd>
          <dt>Care networks</dt><dd>${P.networks.map(n => `<a ${ext(n[2])}>${esc(n[0])}</a>`).join(" · ")}</dd>
        </dl></div></div>
      <div class="grid2">
        <div class="dsec"><h3>${ic("file")}Read</h3><div class="box"><ul class="linklist">${P.read.map(([i, t, s, u]) => `<li><a ${ext(u)}><span class="ico">${ic(i)}</span><span class="t">${esc(t)}<small>${esc(s)}</small></span>${ic("ext", "go")}</a></li>`).join("")}</ul></div></div>
        <div class="dsec"><h3>${ic("play")}Watch</h3><div class="videos">${P.watch.map(([t, s, u]) => `<a class="vid" ${ext(u)}>${ic("play")}<span>${esc(t)}<small>${esc(s)}</small></span></a>`).join("")}</div>
          <p class="sub">Video links open YouTube searches so you always see current uploads.</p></div>
      </div>`;
    },
    journey(P) {
      return `<div class="dsec">
        <h3>${ic("route")}Patient journey & stakeholder map</h3>
        <p class="sub">What happens at each stage, how the patient feels, the pain point, and who leads or supports. Click ${ic("badge")} on a stakeholder for US credentials.</p>
        ${P.specific ? "" : `<div class="srcnote">${ic("route")}<span>This journey uses a typical template; disease facts and therapies are specific.</span></div>`}
        ${journeyMap(P)}</div>`;
    },
    stakeholders(P) {
      const groups = { care: "Care team", dx: "Diagnostics & specialists", sys: "System & industry" };
      return Object.entries(groups).map(([g, label]) => {
        const rows = P.stakeholders.filter(r => r[0] === g);
        if (!rows.length) return "";
        return `<div class="dsec"><h3>${ic(g === "sys" ? "building" : g === "dx" ? "flask" : "steth")}${label}</h3><div class="grid3">${rows.map(([gg, name, icon, map, role]) => {
          const L = stageList(P, map, "L"), S = stageList(P, map, "S");
          return `<div class="box tile g-${gg}"><span class="ico">${ic(icon)}</span><div style="min-width:0">
            <strong style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)">${esc(name)}</strong>${esc(role)}
            <div class="mini">${L.map(s => `<span style="color:var(--good)">Leads: ${esc(s)}</span>`).join("")}${S.map(s => `<span>Supports: ${esc(s)}</span>`).join("")}</div>
            <div class="tilelinks"><button class="linkbtn" type="button" data-cert="${esc(name)}">${ic("badge")} US credentials</button>${window.RDScreener && window.RDScreener.isTarget(name, gg) ? `<button class="linkbtn" type="button" data-screener="${esc(name)}">${ic("clipboard")} Draft screener</button>` : ""}</div>
          </div></div>`;
        }).join("")}</div></div>`;
      }).join("");
    },
    access(P) {
      return `
      <div class="dsec"><h3>${ic("users")}Who influences access in the US</h3>
        <div class="box"><ul class="inf">${P.access.map(([i, w, l, a, y]) => `<li><span class="ico">${ic(i)}</span><span class="top"><strong>${esc(w)}</strong><span class="lever">${esc(l)}</span></span><span class="why"><em>${esc(a)}</em> · ${esc(y)}</span></li>`).join("")}</ul></div></div>
      <div class="grid2">
        <div class="dsec"><h3>${ic("landmark")}US rules that matter here</h3><div class="box"><ul class="factlist">${P.facts.map(f => `<li>${ic("check")}<span>${esc(f)}</span></li>`).join("")}</ul></div></div>
        <div class="dsec"><h3>${ic("hospital")}Care networks</h3><div class="box"><ul class="linklist">${P.networks.map(n => `<li><a ${ext(n[2])}><span class="ico">${ic("hospital")}</span><span class="t">${esc(n[0])}<small>${esc(n[1])}</small></span>${ic("ext", "go")}</a></li>`).join("")}</ul></div></div>
      </div>
      <div class="dsec"><h3>${ic("alert")}Reality check</h3><ul class="reality">${P.reality.map(x => `<li>${ic("alert")}${esc(x)}</li>`).join("")}</ul></div>`;
    },
    pipeline(P) {
      return `
      <div class="dsec"><h3>${ic("pill")}Therapies & pipeline (US status)</h3>
        ${P.pipeline.length ? `<div class="box"><ul class="pipe">${P.pipeline.map(([n, c, st, note]) => {
          const s = STATUS[st] || STATUS["1"];
          return `<li><div><strong>${esc(n)}</strong><small>${esc(c)}${note ? " · " + esc(note) : ""}</small></div>
            <div><div class="ladder ${esc(st)}">${[1, 2, 3, 4].map(k => `<span class="${k <= s.step ? "on" : ""}"></span>`).join("")}</div>
            <div class="ladderlbl"><span class="pill ${esc(st)}">${esc(s.label)}</span></div></div></li>`;
        }).join("")}</ul></div>
        <p class="sub">Ladder: Phase 1–2 · Phase 3 · FDA review · FDA approved. Amber = approved only outside the US, or used off-label.</p>`
        : `<div class="box">No approved therapy or late-stage candidate listed. Check recruiting trials below.</div>`}
      </div>
      <div class="dsec"><h3>${ic("bulb")}Beyond drugs</h3>
        <div class="beyond">${P.beyond.map(([i, t, w, v, u]) => u ? `<a ${ext(u)}>${ic(i)}<strong>${esc(t)}</strong><span>${esc(v)}</span><small>${esc(w)}</small></a>` : `<div>${ic(i)}<strong>${esc(t)}</strong><span>${esc(v)}</span><small>${esc(w)}</small></div>`).join("")}</div></div>`;
    },
    gaps(P) {
      const label = { high: "Major", med: "Notable", low: "Emerging" };
      return `<div class="dsec"><h3>${ic("alert")}Gaps people talk about</h3>
        <div class="grid3">${P.gaps.map(([i, t, d, s, who]) => `<div class="gapcard"><span class="ico">${ic(i)}</span><div>
          <span class="sev ${s}">${label[s]}</span><strong>${esc(t)}</strong>${esc(d)}
          <div class="mini">${who.map(x => `<span>${esc(x)}</span>`).join("")}</div></div></div>`).join("")}</div></div>`;
    },
    companies(P) {
      return `<div class="dsec"><h3>${ic("building")}Companies & organizations</h3>
        <div class="grid3">${P.companies.map(([i, n, t, w, tags]) => `<div class="cocard"><span class="ico">${ic(i)}</span><div style="min-width:0">
          <strong>${esc(n)}</strong><span class="type">${esc(t)}</span><p>${esc(w)}</p>
          ${tags && tags.length ? `<div class="mini">${tags.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}</div></div>`).join("")}</div></div>`;
    },
    screener() {
      return `<div id="screenerMount"></div>`;
    },
    certs(P) {
      const items = certTargets(P);
      const V = US.VERIFY;
      return `
      <div class="dsec"><h3>${ic("badge")}US licenses & certifications by stakeholder</h3>
        <p class="sub">State licensure is required by law to practice. Board certification is voluntary under law but expected by most hospitals and payer networks. Verify individuals before recruiting.</p>
        <div class="grid3">${items.map(it => {
          const creds = US.credentialsFor(it.name, it.g);
          if (!creds.length) return "";
          return `<div class="certcard" data-certname="${esc(it.name)}">
            <header><span class="ico g-${it.g}" style="color:var(--gc)">${ic(it.icon)}</span><div style="min-width:0"><strong>${esc(it.name)}</strong><small>${esc(creds.map(c => c.kind === "US requirement" ? c.title : c.kind).join(" + "))}</small></div></header>
            ${creds.map(cr => `<dl class="req">
              ${creds.length > 1 && cr.kind === "US requirement" ? `<dt>Role</dt><dd><b>${esc(cr.title)}</b></dd>` : ""}
              ${cr.req ? `<dt>Required</dt><dd>${esc(cr.req)}</dd>` : ""}
              ${cr.board ? `<dt>Certified</dt><dd>${esc(cr.board)}</dd>` : ""}
              ${cr.note ? `<dt>Note</dt><dd>${esc(cr.note)}</dd>` : ""}
            </dl>
            ${cr.verify && cr.verify.length ? `<div class="verify">${cr.verify.filter(k => V[k]).map(k => `<a ${ext(V[k][1])}>${esc(V[k][0])}</a>`).join("")}</div>` : ""}`).join("")}
          </div>`;
        }).join("")}</div></div>`;
    },
  };

  /* ===================== DIRECTORY & GENERIC ===================== */
  function showDirectory(filter = "") {
    closeDrawer(); CUR = null; showPage(); emit();
    const by = {};
    for (const it of INDEX) (by[it.cat] = by[it.cat] || []).push(it);
    $("#page").innerHTML = `
      <div class="dhead"><div><div class="eyebrow">Directory · US</div><h1>${INDEX.length} rare diseases</h1><div class="aka">Every profile has a disease-specific journey, stakeholder map, gaps and US access view.</div></div></div>
      <div class="dirtools"><input id="dirFilter" type="search" placeholder="Filter the list" aria-label="Filter diseases" value="${esc(filter)}"></div>
      <div class="dirgrid" id="dirGrid"></div>`;
    const paint = q => {
      const n = norm(q);
      $("#dirGrid").innerHTML = Object.entries(CATS).filter(([k]) => by[k]).map(([k, c]) => {
        const list = by[k].filter(it => !n || it.terms.some(t => t.includes(n))).sort((a, b) => a.name.localeCompare(b.name));
        if (!list.length) return "";
        return `<section class="dircat"><header>${ic(c.i)}<h2>${esc(c.l)}</h2><span class="count">${list.length}</span></header>
          <ul>${list.map(it => `<li><button type="button" data-open="${it.key}">${esc(it.name)}</button></li>`).join("")}</ul></section>`;
      }).join("") || `<p>No disease matches “${esc(q)}”.</p>`;
    };
    paint(filter);
    $("#dirFilter").addEventListener("input", e => paint(e.target.value));
    setHash("directory");
  }
  function renderGeneric(q) {
    const e = encodeURIComponent(q);
    const L = (i, t, s, u) => `<li><a ${ext(u)}><span class="ico">${ic(i)}</span><span class="t">${esc(t)}<small>${esc(s)}</small></span>${ic("ext", "go")}</a></li>`;
    return `
    <div class="notice">${ic("search")}“${esc(q)}” isn't in the directory yet. These US research links search live sources. <button type="button" class="linkbtn" data-act="dir">Browse the directory</button></div>
    <div class="dhead"><div><div class="eyebrow">Quick research · US</div><h1>${esc(q)}</h1></div></div>
    <div class="dash">
      <article class="card s6"><header>${ic("book")}<h2>About the disease</h2></header><ul class="linklist">
        ${L("book", "Patient overview", "NIH GARD", "https://rarediseases.info.nih.gov/search?term=" + e)}
        ${L("users", "Rare disease report", "NORD", "https://rarediseases.org/?s=" + e)}
        ${L("file", "Reviews", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + e + "&filter=pubt.review")}
        ${L("play", "Explainer videos", "YouTube", "https://www.youtube.com/results?search_query=" + e + "+explained")}</ul></article>
      <article class="card s6"><header>${ic("coins")}<h2>US access & pipeline</h2></header><ul class="linklist">
        ${L("flask", "Recruiting US trials", "ClinicalTrials.gov", "https://clinicaltrials.gov/search?cond=" + e + "&country=United%20States&aggFilters=status:rec")}
        ${L("landmark", "Orphan drug designations", "FDA", "https://www.accessdata.fda.gov/scripts/opdlisting/oopd/")}
        ${L("scale", "Value assessments", "ICER", "https://icer.org/?s=" + e)}
        ${L("coins", "Cost & burden studies", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + e + "+cost+OR+burden+United+States")}</ul></article>
    </div>`;
  }

  /* ===================== SEARCH UI ===================== */
  function wireSearch(form, input, list) {
    let sel = -1, items = [];
    const close = () => { list.hidden = true; list.innerHTML = ""; items = []; sel = -1; input.setAttribute("aria-expanded", "false"); };
    const paint = () => list.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-selected", i === sel));
    input.addEventListener("input", () => {
      items = rank(input.value).slice(0, 8);
      if (!items.length) { close(); return; }
      list.innerHTML = items.map(({ it }) => `<li><button type="button" tabindex="-1" data-k="${it.key}">${esc(it.name)}<span class="cat">${ic(CATS[it.cat]?.i || "target")}${esc(CATS[it.cat]?.l || "")}</span></button></li>`).join("");
      list.hidden = false; sel = -1; input.setAttribute("aria-expanded", "true");
    });
    input.addEventListener("keydown", e => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, -1); paint(); }
      else if (e.key === "Escape") close();
    });
    list.addEventListener("mousedown", e => e.preventDefault());
    list.addEventListener("click", e => { const b = e.target.closest("button[data-k]"); if (b) { close(); input.value = ""; openItem(b.dataset.k); } });
    input.addEventListener("blur", () => setTimeout(close, 120));
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (sel >= 0 && items[sel]) { const k = items[sel].it.key; close(); input.value = ""; openItem(k); }
      else { const v = input.value; close(); go(v); }
    });
  }
  wireSearch($("#homeForm"), $("#homeQ"), $("#homeSug"));
  wireSearch($("#topForm"), $("#topQ"), $("#topSug"));

  $("#homeChips").innerHTML = ["Bronchiectasis", "Hereditary angioedema", "Spinal muscular atrophy", "Desmoid tumor", "Demodex blepharitis"]
    .map(s => `<button class="chip" type="button" data-q="${esc(s)}">${esc(s)}</button>`).join("");
  $("#browseLink").textContent = `Browse all ${INDEX.length} diseases`;
  $("#features").innerHTML = [["route", "Journey & stakeholder maps"], ["coins", "US access & payers"], ["clipboard", "Screener builder"], ["badge", "Certifications"], ["chat", "Disease assistant"]]
    .map(([i, t]) => `<li>${ic(i)}${t}</li>`).join("");

  /* ===================== EVENTS ===================== */
  document.addEventListener("click", e => {
    const t = e.target;
    const q = t.closest("[data-q]"); if (q && q.classList.contains("chip")) { go(q.dataset.q); return; }
    const o = t.closest("[data-open]"); if (o) { e.preventDefault(); openItem(o.dataset.open); return; }
    const cert = t.closest("[data-cert]"); if (cert) { e.preventDefault(); openTab("certs", cert.dataset.cert); return; }
    const scr = t.closest("[data-screener]"); if (scr) { e.preventDefault(); openTab("screener", scr.dataset.screener); return; }
    const dt = t.closest("[data-dtab]"); if (dt) { openTab(dt.dataset.dtab); return; }
    const act = t.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "chat") { document.dispatchEvent(new CustomEvent("rd:chat-open")); return; }
      if (act.dataset.act === "dir") { showDirectory(); return; }
    }
    if (t.closest("[data-close]")) { closeDrawer(); return; }
    const tab = t.closest("[data-tab]");
    if (tab && !t.closest("a")) { openTab(tab.dataset.tab); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#drawer").hidden && !e.defaultPrevented) { closeDrawer(); }
    if (e.key === "Tab" && !$("#drawer").hidden && $("#chat").hidden) {
      const f = [...$("#drawer").querySelectorAll("button,a[href],input,select,textarea,[contenteditable=true]"), $("#chatFab")].filter(x => x.getClientRects().length);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $("#homeBtn").addEventListener("click", showHome);
  $("#dirBtn").addEventListener("click", () => showDirectory());
  $("#browseLink").addEventListener("click", () => showDirectory());

  /* deep links: #bronchiectasis, #fabry-disease, #directory */
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) { showHome(); return; }
    if (h === "directory") { showDirectory(); return; }
    if (CUR && CUR.key === h) return;
    const it = INDEX.find(x => slug(x.name) === h);
    it ? openItem(it.key) : go(h.replace(/-/g, " "));
  }
  window.addEventListener("hashchange", fromHash);

  /* ===================== PUBLIC API ===================== */
  function profileText(P) {
    const lines = [];
    lines.push(`DISEASE: ${P.name}${P.aka ? " (also: " + P.aka + ")" : ""}`);
    lines.push(`Category: ${P.catLabel}. ICD-10-CM: ${P.icd || "n/a"}. US estimate: ${P.est ? P.est.text : P.prevalence}. ${P.orphan ? P.orphan.text + "." : ""} Newborn screening: ${P.nbs.text}.`);
    lines.push(`What: ${P.what}\nCause: ${P.cause}\nDiagnosis: ${P.dx}\nTreatment: ${P.tx}\nSpecialists: ${P.specialists.join(", ")}`);
    lines.push("PATIENT JOURNEY (stage | time | what happens | patient feels 1-5 | pain point):");
    P.stages.forEach(s => lines.push(`- ${s.n} | ${s.t} | ${s.d.join("; ")} | ${s.f} ${s.w} ${s.q} | ${s.p}`));
    lines.push("STAKEHOLDERS (group | name | role | leads at | supports at):");
    P.stakeholders.forEach(([g, n, , map, role]) => lines.push(`- ${g} | ${n} | ${role} | ${stageList(P, map, "L").join(", ") || "-"} | ${stageList(P, map, "S").join(", ") || "-"}`));
    lines.push("US ACCESS (who | lever | affects | why):");
    P.access.forEach(([, w, l, a, y]) => lines.push(`- ${w} | ${l} | ${a} | ${y}`));
    lines.push("US facts: " + P.facts.join(" "));
    lines.push("Care networks: " + P.networks.map(n => `${n[0]} (${n[2]})`).join("; "));
    lines.push("THERAPIES & PIPELINE (name | company | US status | note):");
    P.pipeline.forEach(([n, c, st, note]) => lines.push(`- ${n} | ${c} | ${STATUS[st]?.label || st} | ${note || ""}`));
    lines.push("GAPS (severity | gap | detail | owners):");
    P.gaps.forEach(([, t, d, s, who]) => lines.push(`- ${s} | ${t} | ${d} | ${who.join(", ")}`));
    lines.push("COMPANIES & ORGANIZATIONS: " + P.companies.map(c => `${c[1]} (${c[2]})`).join("; "));
    lines.push("SOURCES ON THIS PAGE:");
    P.read.forEach(([, t, s, u]) => lines.push(`- ${t} — ${s}: ${u}`));
    return lines.join("\n");
  }
  function find(q) {
    return rank(String(q || "")).slice(0, 8).map(x => ({ name: x.it.name, category: CATS[x.it.cat]?.l || "" }));
  }
  function profileTextOf(name) {
    const r = rank(String(name || ""))[0];
    return r && r.s >= 60 ? profileText(buildProfile(DIR[r.it.key])) : "";
  }
  window.RD = {
    get current() { return CUR; }, openTab, closeDrawer, toast, ic, esc, STATUS, profileText, stageList, find, profileTextOf,
    credentialsFor: (n, g) => US.credentialsFor(n, g),
  };

  fromHash();
})();
