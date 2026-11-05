/* Rare·Desk app: search, the tabbed disease page, directory, home news. */
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
    pause: '<circle cx="12" cy="12" r="10"/><path d="M10 9v6M14 9v6"/>',
    tick: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    stadium: '<ellipse cx="12" cy="8.5" rx="9" ry="4"/><path d="M3 8.5v6.5c0 2.2 4 4 9 4s9-1.8 9-4V8.5M7.5 12.2v4.6M12 12.6v5.4M16.5 12.2v4.6"/>',
    arena: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.7 5.7c3.4 3.4 3.4 9.2 0 12.6M18.3 5.7c-3.4 3.4-3.4 9.2 0 12.6"/>',
    plane: '<path d="M10.6 3.6 12 3l1.4.6v6.1l7.6 4.4v2.1l-7.6-2.3v4.4l2.1 1.6v1.6L12 20.6l-3.5.9v-1.6l2.1-1.6v-4.4L3 16.2v-2.1l7.6-4.4Z"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 21v-3M16 21v-3M7.5 14.5h.01M16.5 14.5h.01M8 6.5h8"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5 6.8 16.2M12 11.5l5.2 4.7"/>',
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
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor"/>',
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
  let curTab = "about";    // open tab on the disease page
  function setHash(h) { try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (_) { /* sandboxed */ } }
  function showPage(disease = false) {
    closeSheet(false); storyStop();
    $("#page").classList.toggle("dzpage", disease); document.body.classList.toggle("is-dz", disease);
    $("#home").hidden = true; $("#dock").hidden = false; $("#page").hidden = false; document.body.classList.remove("is-home"); window.scrollTo(0, 0);
  }
  function showHome() {
    closeSheet(false); storyStop(); CUR = null; $("#page").hidden = true; $("#dock").hidden = false; $("#home").hidden = false;
    document.body.classList.add("is-home"); document.body.classList.remove("is-dz");
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
  function openItem(key, typed = null, also = [], tab = "about", arg) {
    const e = DIR[+key]; if (!e) return;
    CUR = buildProfile(e);
    showPage(true); $("#topQ").value = "";
    $("#page").innerHTML = renderDisease(CUR, typed, also);
    fitTabs();
    showTab(tab, arg);
    emit();
  }
  /* Full tab labels when they fit, then short ones, then icons for the tabs that aren't open (wide layouts only) */
  function fitTabs() {
    const bar = $(".dzbar"), tabs = bar && bar.querySelector(".ptabs"); if (!tabs) return;
    bar.classList.remove("short", "icons");
    const fits = () => tabs.scrollWidth <= tabs.clientWidth + 1;
    if (fits()) return;
    bar.classList.add("short");
    if (fits() || innerWidth <= 860) return;
    bar.classList.add("icons");
  }
  let fitQueued = 0;
  addEventListener("resize", () => { if (!fitQueued) fitQueued = requestAnimationFrame(() => { fitQueued = 0; fitTabs(); }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitTabs());

  /* ===================== DISEASE PAGE =====================
     Borrowed from the reference: a charcoal band with the name in a notch and icon pills, a warm light canvas,
     white cards, thin connector lines and lime markers. Every tab opens with a friendly title; pages scroll. */
  const FEEL = f => f >= 4 ? ["happy", "var(--good)"] : f === 3 ? ["neutral", "var(--mid)"] : ["sad", "var(--bad)"];
  const counts = P => {
    const c = { A: 0, F: 0, "3": 0, early: 0, X: 0, O: 0 };
    for (const r of P.pipeline) { if (r[2] === "2" || r[2] === "1") c.early++; else c[r[2]]++; }
    return c;
  };
  const shortName = n => String(n).replace(/ \(.*\)$/, "");
  const chipName = n => String(n).replace(/\s*\([^)]*\)/g, "").trim();
  /* [id, label, icon, short label for narrower screens] */
  const PTABS = [["about", "About", "book", "About"], ["journey", "Causes & journey", "route", "Journey"], ["patients", "US patients", "users", "Patients"],
    ["stakeholders", "Stakeholder map", "network", "Stakeholders"], ["gaps", "Gaps & needs", "alert", "Gaps"], ["innovation", "Innovation", "flask", "Innovation"], ["screener", "Screener builder", "clipboard", "Screener"]];
  const TAB_ALIAS = { people: "stakeholders", certs: "stakeholders", map: "stakeholders", access: "stakeholders", causes: "journey",
    numbers: "patients", us: "patients", needs: "gaps", pipeline: "innovation", companies: "innovation" };
  const AGE_LABEL = { older: ["Older adults", "Mostly diagnosed after 60"], adult: ["Adults", "Mostly working-age adults"], peds: ["Children", "Usually starts in childhood"] };
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* US estimate as numbers: lo–hi, what is counted, where the figure comes from */
  const POP_US = 335e6;
  const toNum = s => /million/.test(s) ? parseFloat(s.replace(/,/g, "")) * 1e6 : Number(s.replace(/,/g, ""));
  function estInfo(P) {
    const e = P.est;
    if (!e) return { kind: "none", lo: null, hi: null, big: "No estimate", short: "n/a", label: P.prevalence || "No reliable US count yet", source: "" };
    const t = String(e.text);
    if (e.source === "label") return { kind: "people", lo: null, hi: null, big: "Ultra-rare", short: "Ultra-rare", label: "in the US; too few people for a reliable count", source: P.prevalence };
    const m = t.match(/(\d[\d,]*(?:\.\d+)?(?:\s*million)?)(?:\s*[–-]\s*(\d[\d,]*(?:\.\d+)?(?:\s*million)?))?/);
    const lo = m ? toNum(m[1]) : e.n, hi = m && m[2] ? toNum(m[2]) : lo;
    const cited = (t.match(/\(([^)]+)\)\s*$/) || [])[1] || "";
    const label = m ? t.slice(m.index + m[0].length).replace(/\s*\([^)]*\)\s*$/, "").trim() : t;
    const fewer = /^fewer than/i.test(t);
    const fmtN = n => n >= 1e6 ? (n / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }) + " million" : Math.round(n).toLocaleString("en-US");
    const sh = n => n >= 1e6 ? (n / 1e6).toLocaleString("en-US", { maximumFractionDigits: n < 1e7 ? 1 : 0 }) + "M" : n >= 1e4 ? Math.round(n / 1e3) + "k" : n >= 1e3 ? (n / 1e3).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k" : String(Math.round(n));
    const pair = (f, a, b) => a === b ? f(a) : f(a) + "–" + f(b);
    return {
      kind: e.kind, lo, hi, fewer,
      big: (fewer ? "Fewer than " : "") + pair(fmtN, lo, hi),
      short: (fewer ? "<" : "") + pair(sh, lo, hi),
      unit: e.kind === "births" ? "births/yr" : e.kind === "incidence" ? "new cases/yr" : "people",
      label: label || "people in the US",
      source: e.source === "calc" ? "Calculated from " + P.prevalence : cited && !/^estimat/i.test(cited) ? "Source: " + cited : "Published estimate",
    };
  }
  const oneIn = E => {
    if (E.kind !== "people" || E.lo == null) return "";
    const r = n => { const v = POP_US / n; const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1)); return (Math.round(v / p) * p).toLocaleString("en-US"); };
    const a = r(E.hi), b = r(E.lo);
    return a === b ? a : a + "–" + b;
  };

  /* Plain-English pop-ups for jargon: the first use on each tab gets a dotted underline and a definition */
  const GLOSS = [
    ["Orphan Drug Act", "A 1983 US law that rewards companies for developing drugs for diseases affecting fewer than 200,000 Americans."],
    ["RUSP", "Recommended Uniform Screening Panel: the federal list of conditions newborns should be screened for. Each state decides what it actually tests."],
    ["ICD-10-CM", "The US code set used to label diagnoses on medical claims."],
    ["Part D", "Medicare's coverage for drugs filled at a pharmacy."],
    ["Part B", "Medicare's medical coverage, including drugs given in a clinic or infusion center."],
    ["Medicare Advantage", "Private plans that deliver Medicare benefits, often with extra rules such as prior authorization."],
    ["Medicaid", "Public health coverage for people with low incomes, run by each state."],
    ["CHIP", "Children's Health Insurance Program: low-cost coverage for kids whose families earn too much for Medicaid."],
    ["PBMs", "Pharmacy benefit managers: companies that run a health plan's drug coverage and negotiate prices."],
    ["PBM", "Pharmacy benefit manager: the company that runs a health plan's drug coverage and negotiates prices."],
    ["prior auth", "Prior authorization: approval a health plan requires before it pays for a test or treatment."],
    ["Prior auth", "Prior authorization: approval a health plan requires before it pays for a test or treatment."],
    ["step therapy", "A plan rule that patients try a cheaper drug first before it pays for a pricier one."],
    ["Step therapy", "A plan rule that patients try a cheaper drug first before it pays for a pricier one."],
    ["specialty tier", "The most expensive drug tier in a plan, usually with the highest patient cost."],
    ["ICER", "Institute for Clinical and Economic Review: an independent group that judges whether a drug's price matches its benefit."],
    ["CMS", "Centers for Medicare & Medicaid Services: the federal agency that runs Medicare and oversees Medicaid."],
    ["ABMS", "American Board of Medical Specialties: the umbrella for US doctors' board certifications."],
    ["ABIM", "American Board of Internal Medicine: certifies internists and specialists such as pulmonologists and cardiologists."],
    ["CLIA", "Clinical Laboratory Improvement Amendments: the federal certificate every US lab testing human samples needs."],
    ["ESRD", "End-stage renal disease: kidney failure that needs dialysis or a transplant."],
    ["SSDI", "Social Security Disability Insurance."],
    ["REMS", "Risk Evaluation and Mitigation Strategy: extra FDA safety rules for some drugs."],
    ["HSCT", "Hematopoietic stem cell transplant, also called a bone marrow transplant."],
    ["340B", "A federal program that lets certain hospitals and clinics buy drugs at a discount."],
    ["copay cards", "Manufacturer coupons that lower what a patient pays at the pharmacy; not allowed for Medicare or Medicaid patients."],
    ["hub", "A manufacturer-funded service that helps patients with insurance paperwork, copay help and shipping."],
    ["FDA", "Food and Drug Administration: the US agency that approves drugs and devices."],
  ];
  function gl(text, seen) {
    let h = esc(text);
    const spans = [];
    for (const [term, tip] of GLOSS) {
      if (seen && seen.has(term.toLowerCase())) continue;
      const re = new RegExp("(^|[^\\w-])(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![\\w-])");
      const m = h.match(re); if (!m) continue;
      spans.push(`<span class="gl" tabindex="0" data-tip="${esc(tip)}">${m[2]}</span>`);
      h = h.replace(re, `$1\u0000${spans.length - 1}\u0000`);
      if (seen) seen.add(term.toLowerCase());
    }
    return h.replace(/\u0000(\d+)\u0000/g, (_, k) => spans[+k]);
  }
  /* keep a jargon pop-up on screen: nudge it sideways near the edges, and show it below the term near the top */
  function placeTip(g) {
    const r = g.getBoundingClientRect(), w = Math.min(280, innerWidth * 0.8), mid = r.left + r.width / 2;
    const left = Math.max(12, Math.min(innerWidth - 12 - w, mid - w / 2));
    g.style.setProperty("--shift", Math.round(left - (mid - w / 2)) + "px");
    g.classList.toggle("below", r.top < 200);
  }
  for (const ev of ["mouseover", "focusin"]) document.addEventListener(ev, e => { const g = e.target.closest && e.target.closest(".gl"); if (g) placeTip(g); });
  const jargonCard = seen => {
    const L = GLOSS.filter(([t], i) => seen.has(t.toLowerCase()) && GLOSS.findIndex(g => g[1] === GLOSS[i][1]) === i);
    return L.length ? `<section class="cc jargon"><header class="cch"><h3>${ic("bulb")}Jargon buster</h3><span class="count">Terms on this page</span></header>
      <dl>${L.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("")}</dl></section>` : "";
  };
  const hero = (kicker, title, intro) => `<header class="phero"><span class="kicker">${kicker}</span><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ""}</header>`;
  const secth = (icon, title, extra = "") => `<div class="secth"><h3 class="secttl"><span class="sico2">${ic(icon)}</span>${title}</h3>${extra}</div>`;

  function renderDisease(P, typed, also) {
    return `<div class="dz">
      <header class="dzbar"><div class="dzin">
        <div class="notch"><button class="xbtn" type="button" data-act="home" aria-label="Close ${esc(P.name)} and go home" title="Home">${ic("close")}</button>
          <h1 class="${P.name.length > 34 ? "xlong" : P.name.length > 22 ? "long" : ""}" title="${esc(P.name)}">${esc(P.name)}</h1></div>
        <nav class="ptabs" role="tablist" aria-label="${esc(P.name)}">${PTABS.map(([id, l, i, sh]) => `<button class="ptab" type="button" role="tab" id="t-${id}" data-ptab="${id}" aria-controls="pane" aria-selected="false" tabindex="-1" title="${l}">${ic(i)}<span class="lf">${l}</span><span class="ls">${sh}</span></button>`).join("")}</nav>
      </div></header>
      <div class="canvas">
        ${typed || also.length ? `<div class="match">${typed ? `${ic("search")}<span>Showing <b>${esc(P.name)}</b> for “${esc(typed)}”</span>` : ""}${also.length ? `<span class="eyebrow">Also matching</span>${also.map(it => `<button class="chip" type="button" data-open="${it.key}">${esc(it.name)}</button>`).join("")}` : ""}</div>` : ""}
        ${vitals(P)}
        <div class="pane" id="pane" role="tabpanel" tabindex="-1"></div>
      </div>
    </div>`;
  }
  /* Key numbers under the tab band, like the patient card and vitals in the reference */
  function vitals(P) {
    const c = counts(P), E = estInfo(P), dev = c.F + c["3"] + c.early, major = P.gaps.filter(g => g[3] === "high").length;
    const v = (label, val, unit = "", title = "") => `<div class="vit"${title ? ` title="${esc(title)}"` : ""}><span>${label}</span><b>${val}${unit ? `<small>${unit}</small>` : ""}</b></div>`;
    return `<div class="vitals">
      <div class="idcard"><span class="idico">${ic(P.catIcon)}</span><div><small>Category</small><b>${esc(P.catLabel)}</b></div></div>
      ${v("US patients", esc(E.short), E.short === "n/a" || E.short === "Ultra-rare" ? "" : E.unit, E.big + " " + E.label)}
      ${v("Typical onset", esc((AGE_LABEL[P.age] || AGE_LABEL.adult)[0]))}
      ${v("FDA-approved", c.A, c.A === 1 ? "therapy" : "therapies")}
      ${v("In development", dev, dev === 1 ? "program" : "programs")}
      ${v("Gaps", P.gaps.length, major ? major + " major" : "")}
    </div>`;
  }

  /* ---------- Tab 1: About ---------- */
  function factsFor(P) {
    const E = estInfo(P), c = counts(P), dev = c.F + c["3"] + c.early, F = [], ratio = oneIn(E);
    if (ratio) F.push(`About <mark>1 in ${ratio}</mark> Americans has ${esc(P.name)}.`);
    if (P.orphan) F.push({ rare: `That makes it <mark>rare under US law</mark>: fewer than 200,000 people.`, above: `That's <mark>above the 200,000 line</mark> US law uses to call a disease rare.`, border: `That's <mark>right around the 200,000 line</mark> US law uses to call a disease rare.`, common: `It's <mark>common</mark> in the US, not rare.` }[P.orphan.level]);
    const slow = P.stages.slice(0, 3).find(s => /year/i.test(s.t));
    if (slow) F.push(`The ${esc(slow.n.toLowerCase())} stage alone can take <mark>${esc(slow.t.toLowerCase())}</mark>.`);
    const low = P.stages.reduce((m, s) => s.f < m.f ? s : m, P.stages[0]);
    if (low && low.q) F.push(`Patients find ${esc(low.n.toLowerCase())} the hardest stage: <mark>${esc(low.q)}</mark>`);
    F.push(c.A ? `<mark>${c.A} FDA-approved ${c.A === 1 ? "therapy" : "therapies"}</mark> so far${dev ? `, and ${dev} more in development` : ""}.` : `There's <mark>no FDA-approved therapy</mark> yet${dev ? `; ${dev} ${dev === 1 ? "is" : "are"} in development` : ""}.`);
    F.push(`<mark>${P.stakeholders.length} kinds of people</mark> help a patient along the way.`);
    if (P.nbs.level !== "none") F.push(`Newborn screening: <mark>${esc(P.nbs.text)}</mark>.`);
    return F;
  }
  function aboutPane(P) {
    const A = AGE_LABEL[P.age] || AGE_LABEL.adult, E = estInfo(P), seen = new Set(), F = factsFor(P);
    const facts = [
      ["users", "Who gets it", `${A[1]} · ${E.big} ${E.label}`],
      ["scan", "How it's diagnosed", P.dx],
      ["pill", "How it's treated", P.tx],
      ["steth", "Who treats it", P.specialists.join(" · ")],
      ["file", "Also known as", [P.aka, P.icd ? "ICD-10-CM " + P.icd : ""].filter(Boolean).join(" · ")],
    ].filter(f => f[2]);
    return `${hero("About", `Meet ${esc(P.name)}`, "")}
      <div class="about">
        <div class="aboutmain">
          <p class="lead">${esc(P.what)}</p>
          <ul class="facts">${facts.map(([i, k, v], n) => `<li style="--k:${n}"><span class="fico">${ic(i)}</span><div><em>${k}</em><span>${gl(v, seen)}</span></div></li>`).join("")}</ul>
        </div>
        <aside class="dyk" aria-roledescription="carousel" aria-label="Did you know?">
          <header><span class="dykl">${ic("bulb")}Did you know?</span><span class="dykn" id="dykN">1 / ${F.length}</span></header>
          <p class="dykt" id="dykT" aria-live="polite">${F[0]}</p>
          <footer><span class="dykdots" aria-hidden="true">${F.map((_, k) => `<i class="${k ? "" : "on"}"></i>`).join("")}</span><button class="dyknext" type="button" data-dyk>Next fact${ic("arrow")}</button></footer>
        </aside>
      </div>
      <section class="sect">${secth("book", "Read more")}
        <div class="readgrid">${P.read.map(([i, t, s, u]) => `<a class="rcard" ${ext(u)}><span class="rico">${ic(i)}</span><span class="rct"><b>${esc(t)}</b><small>${esc(s)}</small></span>${ic("ext", "rgo")}</a>`).join("")}</div></section>
      <section class="sect">${secth("play", "Watch")}
        <div class="videos">${P.watch.map(([t, s, u]) => `<a class="vid" ${ext(u)}><span class="vplay">${ic("play")}</span><span>${esc(t)}<small>${esc(s)}</small></span></a>`).join("")}</div></section>`;
  }
  let dykI = 0;
  function dykNext() {
    const t = $("#dykT"); if (!t || !CUR) return;
    const F = factsFor(CUR);
    dykI = (dykI + 1) % F.length;
    t.classList.remove("swap"); void t.offsetWidth; t.classList.add("swap");
    t.innerHTML = F[dykI];
    $("#dykN").textContent = `${dykI + 1} / ${F.length}`;
    document.querySelectorAll(".dykdots i").forEach((d, k) => d.classList.toggle("on", k === dykI));
  }

  /* ---------- Tab 2: Causes & patient journey ---------- */
  function causeChips(P) {
    const s = String(P.cause || ""), out = [];
    let depth = 0, cur = "";
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === "(") depth++;
      else if (ch === ")") depth = Math.max(0, depth - 1);
      if (!depth && (/[,;·]/.test(ch) || s.startsWith(" or ", i))) { out.push(cur); cur = ""; if (ch === " ") i += 3; continue; }
      cur += ch;
    }
    out.push(cur);
    return out.map(x => x.trim()).filter(x => x.length > 1).map(x => x[0].toUpperCase() + x.slice(1));
  }
  function journeyPane(P) {
    const S = P.stages, n = S.length;
    const stops = S.map((s, i) => `${FEEL(s.f)[1]} ${n > 1 ? (i / (n - 1) * 100).toFixed(1) : 0}%`).join(",");
    return `${hero("Causes & journey", "How it starts, how it unfolds", "The usual causes first, then the road a patient travels, stage by stage. Press play or pick a stage; scroll sideways for the rest.")}
      <section class="sect">${secth("dna", "Usual causes")}
        <div class="cchips">${causeChips(P).map((c, k) => `<span class="cchip" style="--k:${k}">${esc(c)}</span>`).join("")}</div></section>
      <section class="sect">
        ${secth("route", "The patient journey", `<span class="count" id="storyCount">Stage 1 of ${n}</span>
          <button class="tog" id="storyToggle" type="button" data-story="toggle" aria-label="Pause the journey">${ic("pause")}</button>
          <button class="tog" type="button" data-jnav="-1" aria-label="Scroll the journey back">${ic("chev", "flip")}</button><button class="tog" type="button" data-jnav="1" aria-label="Scroll the journey on">${ic("chev")}</button>`)}
        <div class="jscroll" id="jscroll">
          <div class="tl intro" id="story" style="--n:${n};--grad:linear-gradient(90deg,${stops})">
            <div class="rail" aria-hidden="true"><i class="railc"><i class="railveil"></i></i></div>
            ${S.map((s, i) => `<div class="jcol" style="--i:${i}">
              <span class="jwhen"><b>Stage ${i + 1}</b><span>${esc(s.t)}</span></span>
              <button class="mk" type="button" data-story="go" data-i="${i}" style="--fc:${FEEL(s.f)[1]}" aria-label="Stage ${i + 1} of ${n}: ${esc(s.n)}">${ic(s.i)}<span class="mface">${ic(FEEL(s.f)[0])}</span></button>
              <i class="stem" aria-hidden="true"></i>
              ${stageCard(P, s, i)}
            </div>`).join("")}
            <div class="jend"><button class="jplus" type="button" data-askjourney aria-label="Ask the assistant about this journey" title="Ask the assistant about this journey">${ic("plus")}</button></div>
          </div>
        </div>
        <p class="sr" id="storyLive" aria-live="polite"></p>
      </section>`;
  }
  function stageCard(P, s, i) {
    const [face, col] = FEEL(s.f);
    const who = P.stakeholders.filter(r => r[0] !== "patient" && /[LS]/.test(r[3][i] || "")).sort((a, b) => (a[3][i] === "L" ? 0 : 1) - (b[3][i] === "L" ? 0 : 1));
    return `<article class="scard" data-story="go" data-i="${i}" style="--fc:${col}">
      <header><b>${esc(s.n)}</b><span class="sfeel">${ic(face)}${esc(s.w)}<span class="meter" title="Feeling ${s.f} of 5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= s.f ? "on" : ""}"></i>`).join("")}</span></span></header>
      ${s.q ? `<p class="squote">${esc(s.q)}</p>` : ""}
      <ul class="swhat">${s.d.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <p class="spain">${ic("alert")}<span><b>Pain point</b>${esc(s.p)}</span></p>
      ${who.length ? `<div class="swho"><span class="swl">Who's involved</span>${who.slice(0, 4).map(r => `<button class="wchip ${r[3][i]} g-${r[0]}" type="button" data-person="${esc(r[1])}" title="${esc(r[1])} ${r[3][i] === "L" ? "leads" : "supports"} here: ${esc(r[4])}. Open in the stakeholder map."><span class="wi">${ic(r[2])}</span><span>${esc(chipName(r[1]))}</span></button>`).join("")}${who.length > 4 ? `<button class="wmore" type="button" data-ptab="stakeholders" aria-label="${who.length - 4} more: open the stakeholder map">+${who.length - 4}</button>` : ""}</div>` : ""}
    </article>`;
  }

  /* The story: stage by stage, about every 3 seconds; the line lights up, passed stages show how the patient felt */
  const STORY_START = 1200, STORY_STEP = 3000;
  const story = { i: 0, n: 0, playing: false, timer: 0 };
  function storyShow(i, user = false, follow = true) {
    const root = $("#story"); if (!root || !CUR) return;
    const S = CUR.stages, n = S.length;
    i = Math.max(0, Math.min(n - 1, i));
    story.i = i; story.n = n;
    root.querySelectorAll(".mk").forEach((b, k) => { b.classList.toggle("done", k <= i); b.classList.toggle("on", k === i); if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    root.querySelectorAll(".scard").forEach((c, k) => { c.classList.toggle("done", k < i); c.classList.toggle("on", k === i); });
    root.style.setProperty("--p", (n > 1 ? i / (n - 1) * 100 : 0) + "%");
    $("#storyCount").textContent = `Stage ${i + 1} of ${n}`;
    if (user) { const s = S[i]; $("#storyLive").textContent = `Stage ${i + 1} of ${n}: ${s.n}. ${s.w}. ${s.d.join(", ")}. Pain point: ${s.p}.`; }
    /* keep the current stage in view inside the sideways scroller */
    const sc = $("#jscroll"), col = root.querySelectorAll(".jcol")[i];
    if (follow && sc && col) {
      const cr = col.getBoundingClientRect(), sr = sc.getBoundingClientRect(), pad = parseFloat(getComputedStyle(sc).paddingLeft) || 0;
      if (cr.left < sr.left + pad - 1 || cr.right > sr.right - pad + 1)
        sc.scrollTo({ left: Math.max(0, sc.scrollLeft + cr.left - sr.left - pad), behavior: calm() ? "auto" : "smooth" });
    }
    storyToggle();
  }
  function storyToggle() {
    const b = $("#storyToggle"), root = $("#story"); if (!b || !root) return;
    root.classList.toggle("playing", story.playing);
    const [icon, label] = story.playing ? ["pause", "Pause the journey"] : story.i >= story.n - 1 ? ["cycle", "Replay the journey"] : ["play", "Play the journey"];
    b.innerHTML = ic(icon); b.setAttribute("aria-label", label); b.title = label;
  }
  function storyQueue(delay = STORY_STEP) {
    clearTimeout(story.timer);
    if (story.playing && story.i < story.n - 1) story.timer = setTimeout(() => { storyShow(story.i + 1); storyQueue(); }, delay);
    else story.playing = false;
    storyToggle();
  }
  function storyPlay() { story.playing = true; storyShow(story.i >= story.n - 1 ? 0 : story.i + 1, true); storyQueue(); }
  function storyPause() { story.playing = false; storyQueue(); }
  function storyStop() { clearTimeout(story.timer); story.playing = false; }
  function storyMount() {
    storyStop();
    if (!$("#story")) return;
    storyShow(0, false, false);
    story.playing = !calm();                    // reduced motion: no autoplay, press play to step through
    storyQueue(STORY_START + STORY_STEP);
    const sc = $("#jscroll"), hold = () => { if (story.playing) storyPause(); };   // the reader takes over when they scroll the timeline
    sc.addEventListener("wheel", e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) hold(); }, { passive: true });
    sc.addEventListener("touchstart", hold, { passive: true });
  }

  /* ---------- Tab 3: US patients ---------- */
  const UNITS = [["stadium", "NFL stadiums", 70000, "NFL stadium (about 70,000 seats)"], ["arena", "basketball arenas", 19000, "basketball arena (about 19,000 seats)"],
    ["plane", "jumbo jets", 400, "jumbo jet (about 400 seats)"], ["bus", "school buses", 70, "school bus (about 70 seats)"]];
  function compare(E) {
    if (E.lo == null || E.kind === "none") return null;
    const u = UNITS.find(x => E.lo / x[2] >= 2) || UNITS[UNITS.length - 1];
    const a = Math.max(1, Math.round(E.lo / u[2])), b = Math.max(1, Math.round((E.hi || E.lo) / u[2]));
    const n = a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
    const text = E.kind === "births" ? `Each year, enough newborns to fill about <b>${n}</b> ${u[1]}.` : E.kind === "incidence" ? `Each year, enough new patients to fill about <b>${n}</b> ${u[1]}.` : `Enough people to fill about <b>${n}</b> ${u[1]}.`;
    const range = x => { const p = Math.round(E.lo / x[2]), q = Math.round((E.hi || E.lo) / x[2]); return p === q ? fmt(p) : `${fmt(p)}–${fmt(q)}`; };
    const alt = UNITS.filter(x => x !== u && E.lo / x[2] >= 1).slice(0, 2).map(x => ({ icon: x[0], n: range(x), label: x[1] }));
    return { icon: u[0], a, b, text, one: u[3], alt };
  }
  const fmt = n => Number(n).toLocaleString("en-US");
  function patientsPane(P) {
    const E = estInfo(P), A = AGE_LABEL[P.age] || AGE_LABEL.adult, seen = new Set();
    const people = E.kind === "people" && E.lo != null, ratio = oneIn(E), cmp = compare(E);
    /* log scale from 100 people up to at least 1 million */
    const top = Math.max(6, Math.ceil(Math.log10(Math.max(E.hi || 1, 1e6))));
    const pos = n => Math.max(0, Math.min(100, (Math.log10(Math.max(n, 100)) - 2) / (top - 2) * 100));
    const ticks = []; for (let x = 2; x <= top; x++) ticks.push(10 ** x);
    const tick = n => n >= 1e6 ? n / 1e6 + "M" : n >= 1e3 ? n / 1e3 + "k" : String(n);
    const lo = people ? E.lo : E.short === "Ultra-rare" ? 300 : null, hi = people ? E.hi : E.short === "Ultra-rare" ? 3000 : null;
    const verdict = !P.orphan ? (E.kind === "births" || E.kind === "incidence" ? `Only new cases are counted (${E.big} ${E.label}), so the living total isn't shown.` : "Not enough data to compare.")
      : { rare: "Rare by US law: under 200,000 people", above: "Above the 200,000 orphan threshold", border: "Near the 200,000 orphan threshold", common: "Common, not rare in the US" }[P.orphan.level];
    const nbsShort = { core: "On the RUSP", secondary: "RUSP secondary", state: "Some states", none: "Not screened" }[P.nbs.level];
    const stat = (icon, label, val, sub) => `<section class="cc ustat"><span class="ccico">${ic(icon)}</span><em>${label}</em><b>${esc(val)}</b><span>${gl(sub, seen)}</span></section>`;
    const intro = people ? `${esc(E.big)} ${esc(E.label)}${ratio ? `: about 1 in ${ratio} Americans` : ""}.` : `${esc(E.big)} ${esc(E.label)}.`;
    const body = `<div class="usp">
      <section class="cc usbig">
        <span class="bigl">${ic("users")}Estimated US patients</span>
        <div class="bignum"${people ? ` data-lo="${E.lo}" data-hi="${E.hi}"` : ""}>${esc(E.big)}</div>
        <p class="bigsub">${esc(E.label)}</p>
        ${ratio ? `<p class="ratio">≈ 1 in ${ratio} Americans</p>` : ""}
        <p class="src">${ic("file")}<span>${esc(E.source)}</span></p>
      </section>
      ${cmp ? `<section class="cc uscmp"><span class="bigl">${ic("target")}Picture it</span>
        <p class="cmpt">${cmp.text}</p>
        <div class="cmpicons" aria-hidden="true">${Array.from({ length: Math.min(cmp.b, 24) }, (_, k) => `<i class="${k < cmp.a ? "" : "maybe"}" style="--k:${k}">${ic(cmp.icon)}</i>`).join("")}${cmp.b > 24 ? `<span>+${fmt(cmp.b - 24)}</span>` : ""}</div>
        <p class="cmpkey"><i class="sw"></i>One ${esc(cmp.one)}${cmp.b > cmp.a ? `<i class="sw maybe"></i>Top of the estimate` : ""}</p>
        ${cmp.alt.length ? `<div class="cmpalt"><span>Or picture</span>${cmp.alt.map(x => `<b>${ic(x.icon)}${x.n} ${x.label}</b>`).join("")}</div>` : ""}</section>` : ""}
      <section class="cc usgauge">
        <header class="cch"><h3>Rare by US law?</h3><span class="ccico">${ic("scale")}</span></header>
        <div class="gauge">
          <div class="gtrack">${lo != null ? `<i class="grange" style="--a:${pos(lo)}%;--b:${pos(hi)}%"></i>` : ""}<i class="gthr" style="--x:${pos(2e5)}%"><span>200,000</span></i></div>
          <div class="gticks">${ticks.map(t => `<span style="--x:${pos(t)}%">${tick(t)}</span>`).join("")}</div>
        </div>
        <p class="verdict ${P.orphan ? P.orphan.level : "none"}">${esc(verdict)}</p>
        <p class="fine">${gl("The Orphan Drug Act covers diseases affecting fewer than 200,000 people in the US: 7 years of market exclusivity, tax credits and FDA fee waivers. Log scale.", seen)}</p>
      </section>
      <div class="usstats">
        ${stat("user", "Typical onset", A[0], A[1])}
        ${stat("target", "Newborn screening", nbsShort, P.nbs.text)}
        ${stat("coins", "Who pays most", P.payer[0], P.payer[1])}
        ${stat("file", "ICD-10-CM", P.icd || "Not listed", "Confirm the billable code")}
      </div>
      <section class="cc usnet"><header class="cch"><h3>Where patients are treated</h3><span class="ccico">${ic("hospital")}</span></header>
        <ul class="rlist">${P.networks.map(nw => `<li><a ${ext(nw[2])}><span class="rico">${ic("hospital")}</span><span class="rt">${esc(nw[0])}<small>${esc(nw[1])}</small></span>${ic("ext", "rgo")}</a></li>`).join("")}</ul></section>
      <section class="cc usfacts"><header class="cch"><h3>US rules that shape care</h3><span class="ccico">${ic("landmark")}</span></header>
        <ul class="factlist">${P.facts.map(f => `<li>${ic("check")}<span>${gl(f, seen)}</span></li>`).join("")}</ul></section>
    </div>`;
    return `${hero("US patients", "How many Americans live with it", intro)}${body}${jargonCard(seen)}`;
  }
  function countUp() {
    const el = $("#pane .bignum[data-lo]"); if (!el || calm()) return;
    const lo = +el.dataset.lo, hi = +el.dataset.hi, final = el.textContent, t0 = performance.now(), D = 1100;
    const f = n => n >= 1e6 ? (n / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }) + " million" : Math.round(n).toLocaleString("en-US");
    const step = t => {
      if (!el.isConnected) return;
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? (lo === hi ? f(lo * e) : f(lo * e) + "–" + f(hi * e)) : final;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Tab 4: Stakeholder map ---------- */
  const GROUPS = { patient: "Patient & family", care: "Care team", dx: "Diagnostics & specialists", sys: "System & industry" };
  const GORDER = { patient: 0, care: 1, dx: 2, sys: 3 };
  const stageList = (P, map, ch) => [...map].map((c, i) => c === ch ? P.stages[i].n : null).filter(Boolean);
  const mapRows = P => [...P.stakeholders].sort((a, b) => GORDER[a[0]] - GORDER[b[0]]);
  const filterLead = `<span class="pfilt" aria-hidden="true">${ic("sliders")}</span>`;
  function mapPane(P) {
    const rows = mapRows(P), n = P.stages.length;
    const cnt = g => rows.filter(r => r[0] === g).length;
    const filters = [["all", "All", rows.length], ["care", "Care team", cnt("care")], ["dx", "Diagnostics", cnt("dx")], ["sys", "System & industry", cnt("sys")], ["access", "Access & payers", P.access.length]].filter(f => f[2]);
    return `${hero("Stakeholder map", "Who's in the room", `${rows.length} kinds of people touch a patient's care. Here's when each one steps in, and the US license or certification they need.`)}
      <div class="smap">
      <div class="pills" role="group" aria-label="Show">${filterLead}${filters.map(([id, l, c], k) => `<button class="pill2" type="button" data-sf="${id}" aria-pressed="${k === 0}">${l}<span>${c}</span></button>`).join("")}</div>
      <div class="smbody">
        <section class="cc smgrid" id="smGrid">
          <div class="mg${rows.length > 14 ? " dense" : ""}" style="--n:${n}">
            <div class="mgh"><span>Stakeholder</span>${P.stages.map((s, i) => `<span title="Stage ${i + 1}: ${esc(s.n)}"><i class="mnum">${i + 1}</i></span>`).join("")}</div>
            ${rows.map(([g, name, icon, map, role], r) => {
              const on = [...map].map(c => c !== "."), a = on.indexOf(true), b = on.lastIndexOf(true);
              return `<button class="mgr g-${g}" type="button" data-person="${esc(name)}" data-g="${g}" style="--k:${r}" title="${esc(role)}">
                <span class="mgn">${ic(icon)}<span>${esc(name)}</span></span>
                <span class="mgc">${a >= 0 ? `<i class="mspan" style="--a:${a};--b:${b}"></i>` : ""}${[...map].map((c, i) => c === "." ? "" : `<i class="mdot ${c}" style="--i:${i}" title="${c === "L" ? "Leads" : "Supports"}: ${esc(P.stages[i] ? P.stages[i].n : "")}"></i>`).join("")}</span>
              </button>`;
            }).join("")}
          </div>
          <ol class="mgkey" aria-label="Journey stages">${P.stages.map((s, i) => `<li><i class="mnum">${i + 1}</i>${esc(s.n)}</li>`).join("")}</ol>
          <div class="mglegend"><span><i class="mdot L"></i>Leads</span><span><i class="mdot S"></i>Supports</span><span>Pick anyone for their US license</span></div>
        </section>
        <aside class="cc smdetail" id="smDetail" aria-live="polite"></aside>
      </div></div>`;
  }
  function personDetail(P, name) {
    const row = P.stakeholders.find(r => r[1] === name);
    if (!row) return "";
    const [g, , icon, map, role] = row, V = US.VERIFY, seen = new Set();
    const creds = US.credentialsFor(name, g), L = stageList(P, map, "L"), S = stageList(P, map, "S");
    const canScreen = window.RDScreener && (g === "patient" || window.RDScreener.isTarget(name, g));
    return `<header class="pdh"><span class="pico g-${g}">${ic(icon)}</span><div><b>${esc(name)}</b><small>${esc(GROUPS[g])}</small></div></header>
      <p class="prole">${esc(role)}</p>
      ${L.length ? `<div class="pst"><em>Leads at</em><div>${L.map(x => `<span class="L">${esc(x)}</span>`).join("")}</div></div>` : ""}
      ${S.length ? `<div class="pst"><em>Supports at</em><div>${S.map(x => `<span>${esc(x)}</span>`).join("")}</div></div>` : ""}
      ${creds.length ? `<div class="pcred"><h3>${ic("badge")}US license & certification</h3>${creds.map(cr => `<dl class="req">
          ${creds.length > 1 && cr.kind === "US requirement" ? `<dt>Role</dt><dd><b>${esc(cr.title)}</b></dd>` : ""}
          ${cr.kind !== "US requirement" ? `<dt>Type</dt><dd>${esc(cr.kind)}</dd>` : ""}
          ${cr.req ? `<dt>Required</dt><dd>${gl(cr.req, seen)}</dd>` : ""}
          ${cr.board ? `<dt>Certified</dt><dd>${gl(cr.board, seen)}</dd>` : ""}
          ${cr.note ? `<dt>Note</dt><dd>${gl(cr.note, seen)}</dd>` : ""}</dl>
          ${cr.verify && cr.verify.length ? `<div class="verify">${cr.verify.filter(k => V[k]).map(k => `<a ${ext(V[k][1])}>${esc(V[k][0])}</a>`).join("")}</div>` : ""}`).join("")}</div>`
        : `<p class="none">No license involved.</p>`}
      ${canScreen ? `<button class="btn primary" type="button" data-screener="${esc(g === "patient" ? "Patient" : name)}">${ic("clipboard")}Build a screener for ${g === "patient" ? "patients" : "this stakeholder"}</button>` : ""}`;
  }
  function accessDetail(P) {
    const seen = new Set();
    return `<header class="pdh"><span class="pico">${ic("landmark")}</span><div><b>US rules that matter here</b><small>Access & payers</small></div></header>
      <ul class="factlist">${P.facts.map(f => `<li>${ic("check")}<span>${gl(f, seen)}</span></li>`).join("")}</ul>`;
  }
  function mapSelect(name) {
    const P = CUR, d = $("#smDetail"); if (!P || !d) return;
    if (!P.stakeholders.some(r => r[1] === name)) return;
    document.querySelectorAll(".mgr").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.person === name)));
    d.innerHTML = personDetail(P, name);
  }
  function mapFilter(f) {
    const P = CUR, grid = $("#smGrid"); if (!P || !grid) return;
    document.querySelectorAll("[data-sf]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sf === f)));
    const access = f === "access";
    grid.classList.toggle("is-access", access);
    if (access && !grid.querySelector(".acc")) {
      const seen = new Set();
      grid.insertAdjacentHTML("beforeend", `<ul class="acc">${P.access.map(([i, w, l, a, y]) => `<li><span class="rico">${ic(i)}</span><div><b>${gl(w, seen)}</b><span class="lever">${gl(l, seen)}</span><p><em>${esc(a)}</em> · ${gl(y, seen)}</p></div></li>`).join("")}</ul>`);
    }
    grid.querySelectorAll(".mgr").forEach(b => { b.hidden = !(f === "all" || b.dataset.g === f || b.dataset.g === "patient"); });
    if (access) $("#smDetail").innerHTML = accessDetail(P);
    else { const sel = grid.querySelector('.mgr[aria-pressed="true"]:not([hidden])') || grid.querySelector(".mgr:not([hidden]):not(.g-patient)") || grid.querySelector(".mgr:not([hidden])"); if (sel) mapSelect(sel.dataset.person); }
  }
  function mapInit(P, arg) {
    if (arg === "@access") { mapFilter("access"); return; }
    const rows = mapRows(P);
    const name = arg && rows.some(r => r[1] === arg) ? arg
      : (rows.filter(r => r[0] !== "patient").map(r => ({ r, L: (r[3].match(/L/g) || []).length })).sort((a, b) => b.L - a.L)[0] || { r: rows[0] }).r[1];
    mapSelect(name);
    if (arg && name === arg) document.querySelector(`.mgr[data-person="${CSS.escape(name)}"]`)?.scrollIntoView({ block: "nearest" });
  }

  /* ---------- Tab 5: Gaps & needs ---------- */
  function gapsPane(P) {
    const label = { high: "Major", med: "Notable", low: "Emerging" };
    const c = s => P.gaps.filter(g => g[3] === s).length;
    const filters = [["all", "All", P.gaps.length], ["high", "Major", c("high")], ["med", "Notable", c("med")], ["low", "Emerging", c("low")]].filter(f => f[2]);
    return `${hero("Gaps & needs", "What's still missing", `${P.gaps.length} gaps people in the field talk about${c("high") ? `; ${c("high")} of them major` : ""}. Each one names who could close it.`)}
      <div class="gp">
      <div class="pills" role="group" aria-label="Show">${filterLead}${filters.map(([id, l, n], k) => `<button class="pill2" type="button" data-gf="${id}" aria-pressed="${k === 0}">${l}<span>${n}</span></button>`).join("")}</div>
      <div class="gapgrid">${P.gaps.map(([i, t, d, s, who], k) => `<article class="cc gcard sev-${s}" data-sev="${s}" style="--k:${k}">
        <header><span class="gnum">${String(k + 1).padStart(2, "0")}</span><span class="sev ${s}">${label[s]}</span><span class="gico ${s}">${ic(i)}</span></header>
        <h3>${esc(t)}</h3><p>${esc(d)}</p>
        ${who.length ? `<div class="owners"><em>Who can close it</em><div>${who.map(x => `<span>${esc(x)}</span>`).join("")}</div></div>` : ""}
      </article>`).join("")}</div></div>`;
  }
  function gapFilter(f) {
    document.querySelectorAll("[data-gf]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.gf === f)));
    document.querySelectorAll(".gcard").forEach(c => { c.hidden = !(f === "all" || c.dataset.sev === f); });
  }

  /* ---------- Tab 6: Innovation (life sciences) ---------- */
  function innovationPane(P) {
    /* busy columns stay compact: no notes past 3 drugs, and only 5 shown until "+N more" */
    const drug = ([n, c, st, note], full) => `<div class="drug s${st}" title="${esc(n)} · ${esc(c)}${note ? " · " + esc(note) : ""}"><b>${esc(shortName(n))}</b><small>${esc(c)}</small>${note && full ? `<p>${esc(note)}</p>` : ""}</div>`;
    const col = (title, sts, k) => {
      const L = P.pipeline.filter(r => sts.includes(r[2])), full = L.length <= 3;
      return `<div class="pcol${L.length > 5 ? " folded" : ""}" style="--k:${k}"><h3><i class="pmk"></i><span>${title}<b>${L.length}</b></span></h3>${L.length ? L.map(r => drug(r, full)).join("") : `<p class="none">None listed</p>`}${L.length > 5 ? `<button class="pmore" type="button" data-unfold>+${L.length - 5} more</button>` : ""}</div>`;
    };
    const c = counts(P), dev = c.F + c["3"] + c.early;
    const other = P.pipeline.filter(r => r[2] === "X" || r[2] === "O");
    const makers = P.companies.filter(x => x[0] !== "users"), orgs = P.companies.filter(x => x[0] === "users");
    const N = window.NEWS || {}, news = (N.latest || []).filter(x => x.dz === P.name), watch = upcomingWatch().filter(x => x.dz === P.name);
    return `${hero("Innovation", "What's coming next", `${c.A ? `${c.A} FDA-approved ${c.A === 1 ? "therapy" : "therapies"}` : "No FDA-approved therapy yet"}, ${dev} in development, and the companies and ideas behind them.`)}
      <section class="cc board"><header class="cch"><h3>Pipeline · US status</h3><span class="ccico">${ic("flask")}</span></header>
        <div class="pcols">${col("Phase 1–2", ["1", "2"], 0)}${col("Phase 3", ["3"], 1)}${col("FDA review", ["F"], 2)}${col("FDA approved", ["A"], 3)}</div>
        ${other.length ? `<div class="pother">${other.map(r => `<span><span class="pill ${esc(r[2])}">${esc(STATUS[r[2]].short)}</span>${esc(shortName(r[0]))}</span>`).join("")}</div>` : ""}
      </section>
      <div class="inn">
        ${watch.length || news.length ? `<section class="cc"><header class="cch"><h3>In the news</h3><span class="ccico">${ic("bulb")}</span></header><ul class="rlist">
          ${watch.map(w => `<li><a ${ext(w.u)}><span class="rico">${ic("clock")}</span><span class="rt">FDA decision due ${esc(fmtDate(w.d))}: ${esc(w.t)}<small>${esc(w.co)}</small></span>${ic("ext", "rgo")}</a></li>`).join("")}
          ${news.map(x => `<li><a ${ext(x.u)}><span class="rico">${ic("file")}</span><span class="rt">${esc(x.t)}<small>${esc(fmtDate(x.d))} · ${esc(x.src)}</small></span>${ic("ext", "rgo")}</a></li>`).join("")}</ul></section>` : ""}
        <section class="cc"><header class="cch"><h3>Companies on it</h3><span class="count">${makers.length}</span><span class="ccico">${ic("building")}</span></header>
          ${makers.length ? `<ul class="colist${makers.length > 6 ? " folded" : ""}">${makers.map(([i, n, t, , tags]) => `<li><span class="rico">${ic(i)}</span><span class="rt">${esc(n)}<small>${esc((tags || []).slice(0, 2).map(shortName).join(", ") || t)}</small></span><span class="cotype">${esc(t)}</span></li>`).join("")}</ul>${makers.length > 6 ? `<button class="pmore" type="button" data-unfold>+${makers.length - 6} more</button>` : ""}` : `<p class="none">No company programs listed yet.</p>`}
          ${orgs.length ? `<p class="orgs">${ic("users")}<span>${orgs.map(o => esc(o[1])).join(" · ")}</span></p>` : ""}</section>
        <section class="cc"><header class="cch"><h3>Beyond drugs</h3><span class="ccico">${ic("bulb")}</span></header>
          <ul class="rlist">${P.beyond.map(([i, t, w, v, u]) => u ? `<li><a ${ext(u)}><span class="rico">${ic(i)}</span><span class="rt">${esc(t)}<small>${esc(v)}</small></span>${ic("ext", "rgo")}</a></li>` : `<li><span class="nolink"><span class="rico">${ic(i)}</span><span class="rt">${esc(t)}<small>${esc(v)} · ${esc(w)}</small></span></span></li>`).join("")}</ul></section>
      </div>`;
  }

  /* ---------- tabs ---------- */
  const PANES = { about: aboutPane, journey: journeyPane, patients: patientsPane, stakeholders: mapPane, gaps: gapsPane, innovation: innovationPane,
    screener: P => `${hero("Screener builder", "Find the right people to talk to", `Seven quick steps to a recruitment screener for ${esc(P.name)} research: who, credentials, limits, the brief, question types, then a Word file.`)}<div class="scrmount" id="screenerMount"></div>` };
  const INIT = {
    about: () => { dykI = 0; },
    journey: storyMount,
    patients: countUp,
    stakeholders: (P, arg) => mapInit(P, arg),
    screener: (P, arg) => { if (window.RDScreener) window.RDScreener.mount(P, $("#screenerMount"), arg); },
  };
  /* cards ease in as they scroll into view */
  let revealer = null;
  function reveal(root) {
    if (revealer) revealer.disconnect();
    if (calm() || !("IntersectionObserver" in window)) return;
    revealer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    root.querySelectorAll(".phero, .sect, .about, .cc, .usstats > .cc").forEach(el => { el.classList.add("rv"); revealer.observe(el); });
  }
  function showTab(id, arg) {
    const pane = $("#pane"); if (!CUR || !pane) return;
    id = TAB_ALIAS[id] || id;
    if (!PANES[id]) id = "about";
    storyStop();
    const changed = curTab !== id;
    curTab = id;
    document.querySelectorAll(".ptab").forEach(b => { const on = b.dataset.ptab === id; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    pane.setAttribute("aria-labelledby", "t-" + id);
    pane.className = "pane p-" + id;
    pane.innerHTML = PANES[id](CUR);
    reveal(pane);
    if (INIT[id]) INIT[id](CUR, arg);
    const t = $("#t-" + id), bar = t && t.parentElement;
    if (bar) bar.scrollLeft = Math.max(0, t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2);
    if (changed && window.scrollY > 0) window.scrollTo({ top: 0, behavior: "auto" });
    setHash(CUR.key + (id === "about" ? "" : "/" + id));
  }
  /* Kept for the assistant and tests: open a tab by its old name too (people, certs, access, pipeline…) */
  function openTab(tab, arg) {
    if (!CUR) return;
    showTab(tab, tab === "access" && !arg ? "@access" : arg);
  }

  /* ===================== DIRECTORY & GENERIC ===================== */
  function showDirectory(filter = "") {
    CUR = null; showPage(); emit();
    const by = {};
    for (const it of INDEX) (by[it.cat] = by[it.cat] || []).push(it);
    $("#page").innerHTML = `
      <header class="phero dirhero"><span class="kicker">${ic("grid")}Directory · US</span><h1>${INDEX.length} rare diseases, <mark>one tap away</mark></h1><p>Every profile has its own patient journey, stakeholder map, gaps and US access view. Pick one, or filter the list.</p></header>
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
    <header class="phero"><span class="kicker">${ic("search")}Quick research · US</span><h1>${esc(q)}</h1></header>
    <div class="dash">
      <article class="card s6 static"><header><span class="cico">${ic("book")}</span><h2>About the disease</h2></header><ul class="linklist">
        ${L("book", "Patient overview", "NIH GARD", "https://rarediseases.info.nih.gov/search?term=" + e)}
        ${L("users", "Rare disease report", "NORD", "https://rarediseases.org/?s=" + e)}
        ${L("file", "Reviews", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + e + "&filter=pubt.review")}
        ${L("play", "Explainer videos", "YouTube", "https://www.youtube.com/results?search_query=" + e + "+explained")}</ul></article>
      <article class="card s6 static"><header><span class="cico">${ic("coins")}</span><h2>US access & pipeline</h2></header><ul class="linklist">
        ${L("flask", "Recruiting US trials", "ClinicalTrials.gov", "https://clinicaltrials.gov/search?cond=" + e + "&country=United%20States&aggFilters=status:rec")}
        ${L("landmark", "Orphan drug designations", "FDA", "https://www.accessdata.fda.gov/scripts/opdlisting/oopd/")}
        ${L("scale", "Value assessments", "ICER", "https://icer.org/?s=" + e)}
        ${L("coins", "Cost & burden studies", "PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + e + "+cost+OR+burden+United+States")}</ul></article>
    </div>`;
  }

  /* ===================== SEARCH UI ===================== */
  /* withButtons: repeat the home page's two buttons under the suggestions, which otherwise cover them (as Google does) */
  const SUG_BUTTONS = `<li class="sugfoot" role="presentation"><button type="button" tabindex="-1" data-hb="explore">Explore directory</button><button type="button" tabindex="-1" data-hb="lucky">I'm feeling lucky</button></li>`;
  function wireSearch(form, input, list, withButtons = false) {
    let sel = -1, items = [];
    const close = () => { list.hidden = true; list.innerHTML = ""; items = []; sel = -1; input.setAttribute("aria-expanded", "false"); };
    const paint = () => list.querySelectorAll("button[data-k]").forEach((b, i) => b.setAttribute("aria-selected", i === sel));
    input.addEventListener("input", () => {
      items = rank(input.value).slice(0, 8);
      if (!items.length) { close(); return; }
      list.innerHTML = items.map(({ it }) => `<li><button type="button" tabindex="-1" data-k="${it.key}">${esc(it.name)}<span class="cat">${ic(CATS[it.cat]?.i || "target")}${esc(CATS[it.cat]?.l || "")}</span></button></li>`).join("") + (withButtons ? SUG_BUTTONS : "");
      list.hidden = false; sel = -1; input.setAttribute("aria-expanded", "true");
    });
    input.addEventListener("keydown", e => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, -1); paint(); }
      else if (e.key === "Escape") close();
    });
    list.addEventListener("mousedown", e => e.preventDefault());
    list.addEventListener("click", e => {
      const hb = e.target.closest("button[data-hb]");
      if (hb) { close(); if (hb.dataset.hb === "lucky") lucky(input); else showDirectory(); return; }
      const b = e.target.closest("button[data-k]"); if (b) { close(); input.value = ""; openItem(b.dataset.k); }
    });
    input.addEventListener("blur", () => setTimeout(close, 120));
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (sel >= 0 && items[sel]) { const k = items[sel].it.key; close(); input.value = ""; openItem(k); }
      else { const v = input.value; close(); go(v); }
    });
  }
  wireSearch($("#homeForm"), $("#homeQ"), $("#homeSug"));
  wireSearch($("#topForm"), $("#topQ"), $("#topSug"), true);

  /* ===================== HOME NEWS ===================== */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = d => { const [y, m, day] = String(d).split("-").map(Number); return day ? `${MONTHS[m - 1]} ${day}, ${y}` : `${MONTHS[m - 1]} ${y}`; };
  const NEWS_KIND = { approval: ["check", "FDA approval"], policy: ["landmark", "FDA policy"], payment: ["coins", "Medicare"], deal: ["building", "Industry"], screening: ["target", "Newborn screening"] };
  const HOME_NEWS = 8, WATCH_PER_SLIDE = 5;
  /* FDA decisions still ahead of today (the viewer's local date), soonest first; a month-only date counts until month end */
  function upcomingWatch() {
    const t = new Date(), p2 = n => String(n).padStart(2, "0"), today = `${t.getFullYear()}-${p2(t.getMonth() + 1)}-${p2(t.getDate())}`;
    const due = w => (String(w.d).length === 7 ? w.d + "-31" : String(w.d));
    return ((window.NEWS || {}).watch || []).filter(w => due(w) >= today).sort((a, b) => due(a) < due(b) ? -1 : due(a) > due(b) ? 1 : 0);
  }
  function renderNews() {
    const N = window.NEWS; if (!N) return;
    const keyOf = name => (INDEX.find(x => x.name === name) || {}).key;
    const openBtn = (name, label) => { const k = name ? keyOf(name) : undefined; return k === undefined ? "" : `<button class="linkbtn" type="button" data-open="${k}">${esc(label)}${ic("chev")}</button>`; };
    const latest = (N.latest || []).slice(0, HOME_NEWS), W = upcomingWatch(), groups = [];
    const per = matchMedia("(max-width:600px)").matches ? 3 : WATCH_PER_SLIDE;   /* phones: shorter cards that clear the dock */
    for (let i = 0; i < W.length; i += per) groups.push(W.slice(i, i + per));
    const total = latest.length + groups.length, yr = ", " + new Date().getFullYear();
    const day = d => fmtDate(d).replace(/, \d{4}$/, ""), dayY = d => { const f = fmtDate(d); return f.endsWith(yr) ? f.slice(0, -yr.length) : f; };
    const slides = latest.map((n, i) => {
      const [ki, kl] = NEWS_KIND[n.k] || ["file", "News"];
      return `<article class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${total}">
        <div class="ntop"><span class="nkind ${esc(n.k)}">${ic(ki)}${kl}</span><time datetime="${esc(n.d)}">${fmtDate(n.d)}</time></div>
        <h3>${esc(n.t)}</h3><p>${esc(n.s)}</p>
        <div class="nfoot"><a ${ext(n.u)}>${esc(n.src)}${ic("ext")}</a>${openBtn(n.dz, n.dz || "")}</div>
      </article>`;
    });
    groups.forEach((G, g) => slides.push(`<article class="slide" role="group" aria-roledescription="slide" aria-label="${latest.length + g + 1} of ${total}">
        <div class="ntop"><span class="nkind watch">${ic("clock")}FDA decisions to watch</span><span class="count">${G.length > 1 ? `${dayY(G[0].d)} – ${dayY(G[G.length - 1].d)}` : dayY(G[0].d)} · company-announced dates</span></div>
        <ul class="watchlist">${G.map(w => `<li><time datetime="${esc(w.d)}" title="${esc(fmtDate(w.d))}">${day(w.d)}</time>
          <span><b>${esc(w.t)}</b><span class="wfor">${esc(w.co)} · ${esc(w.for)}</span></span>
          <span class="wlinks"><a ${ext(w.u)}>${esc(w.src)}${ic("ext")}</a>${openBtn(w.dz, "Profile")}</span></li>`).join("")}</ul>
      </article>`));
    $("#newsNote").textContent = `US · updated ${fmtDate(N.asOf)} · swipe for more`;
    $("#newsSlides").innerHTML = slides.join("");
    $("#newsDots").innerHTML = slides.map((_, i) => `<button class="dotbtn" type="button" role="tab" aria-label="Headline ${i + 1} of ${total}" aria-selected="${i === 0}" data-slide="${i}"><span></span></button>`).join("");
  }
  renderNews();

  /* Carousel: native swipe/scroll with snap; dots show the position and jump on click; arrow keys move one */
  (function newsCarousel() {
    const track = $("#newsSlides"), dots = $("#newsDots");
    if (!track || !dots) return;
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : track.clientWidth);
    const current = () => Math.round(track.scrollLeft / step());
    const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
    const go2 = i => { const n = track.children.length; i = Math.max(0, Math.min(n - 1, i)); track.scrollTo({ left: i * step(), behavior: smooth() }); };
    /* phones: the card hugs the headline in view instead of the tallest slide */
    const fitH = () => {
      if (!matchMedia("(max-width:600px)").matches) { track.style.height = ""; return; }
      const sl = track.children[current()]; if (sl) track.style.height = sl.offsetHeight + 4 + "px";
    };
    let raf = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const c = current(); dots.querySelectorAll(".dotbtn").forEach((d, i) => d.setAttribute("aria-selected", String(i === c))); fitH(); });
    }, { passive: true });
    addEventListener("resize", () => requestAnimationFrame(fitH));
    requestAnimationFrame(fitH);
    dots.addEventListener("click", e => { const d = e.target.closest("[data-slide]"); if (d) go2(+d.dataset.slide); });
    track.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); go2(current() + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go2(current() - 1); }
    });
  })();

  /* "I'm feeling lucky": best match for what's typed, or a random disease when the box is empty */
  function lucky(input = $("#homeQ")) {
    const v = input.value.trim();
    const r = v ? rank(v) : [];
    if (v && !r.length) { go(v); return; }
    const key = r.length ? r[0].it.key : INDEX[Math.floor(Math.random() * INDEX.length)].key;
    input.value = "";
    openItem(key);
  }

  /* ===================== DOCK SEARCH SHEET ===================== */
  let sheetReturn = null;
  function openSheet() {
    const sh = $("#sheet"); if (!sh.hidden) return;
    sheetReturn = document.activeElement;
    sh.hidden = false; $("#topQ").value = ""; $("#topQ").focus();
    $("#dockSearch").setAttribute("aria-expanded", "true");
  }
  function closeSheet(restore = true) {
    const sh = $("#sheet"); if (sh.hidden) return;
    sh.hidden = true; $("#topSug").hidden = true; $("#topSug").innerHTML = "";
    $("#dockSearch").setAttribute("aria-expanded", "false");
    if (restore && sheetReturn && document.contains(sheetReturn) && sheetReturn.getClientRects().length) sheetReturn.focus();
  }

  /* ===================== EVENTS ===================== */
  document.addEventListener("click", e => {
    const t = e.target;
    const q = t.closest("[data-q]"); if (q && q.classList.contains("chip")) { go(q.dataset.q); return; }
    const o = t.closest("[data-open]"); if (o) { e.preventDefault(); openItem(o.dataset.open); return; }
    const pt = t.closest("[data-ptab]"); if (pt) { showTab(pt.dataset.ptab); return; }
    const person = t.closest("[data-person]");
    if (person) { if (curTab === "stakeholders") mapSelect(person.dataset.person); else showTab("stakeholders", person.dataset.person); return; }
    const scr = t.closest("[data-screener]"); if (scr) { e.preventDefault(); showTab("screener", scr.dataset.screener); return; }
    const sf = t.closest("[data-sf]"); if (sf) { mapFilter(sf.dataset.sf); return; }
    const gf = t.closest("[data-gf]"); if (gf) { gapFilter(gf.dataset.gf); return; }
    const uf = t.closest("[data-unfold]"); if (uf) { (uf.closest(".folded") || uf.previousElementSibling).classList.remove("folded"); uf.remove(); return; }
    const act = t.closest("[data-act]");
    if (act) {
      if (act.dataset.act === "chat") { document.dispatchEvent(new CustomEvent("rd:chat-open")); return; }
      if (act.dataset.act === "dir") { showDirectory(); return; }
      if (act.dataset.act === "home") { showHome(); return; }
    }
    if (t.closest("[data-dyk]")) { dykNext(); return; }
    const jn = t.closest("[data-jnav]");
    if (jn) { const sc = $("#jscroll"), col = sc && sc.querySelector(".jcol"); if (col) { storyPause(); sc.scrollBy({ left: +jn.dataset.jnav * (col.offsetWidth + 24), behavior: calm() ? "auto" : "smooth" }); } return; }
    if (t.closest("[data-askjourney]") && CUR) { document.dispatchEvent(new CustomEvent("rd:chat-open", { detail: { prompt: `Walk me through the ${CUR.name} patient journey: where are the biggest delays, and who could fix them?` } })); return; }
    /* journey story: play/pause, or jump to a stage */
    const st = t.closest("[data-story]");
    if (st) {
      if (st.dataset.story === "toggle") { if (story.playing) storyPause(); else storyPlay(); return; }
      storyPause(); storyShow(+st.dataset.i, true);
    }
  });
  const STEP_KEYS = /^(ArrowLeft|ArrowRight|Home|End)$/;
  const stepTo = (key, i, n) => key === "Home" ? 0 : key === "End" ? n - 1 : i + (key === "ArrowRight" ? 1 : -1);
  document.addEventListener("keydown", e => {
    if (e.key === "Tab" && !$("#sheet").hidden) {
      const f = [...$("#sheet").querySelectorAll("button,a[href],input,select,textarea")].filter(x => x.getClientRects().length && x.getAttribute("tabindex") !== "-1");
      if (f.length && e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (f.length && !e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    const el = e.target.closest ? e.target : null;
    /* tab bar: arrow keys, Home and End move between tabs */
    const tb = el && el.closest(".ptab");
    if (tb && STEP_KEYS.test(e.key)) {
      e.preventDefault();
      const ids = PTABS.map(x => x[0]), n = ids.length, next = (stepTo(e.key, ids.indexOf(tb.dataset.ptab), n) + n) % n;
      showTab(ids[next]); $("#t-" + ids[next]).focus();
      return;
    }
    /* journey stages: the same keys move between stages */
    const mk = el && el.closest(".mk");
    if (mk && STEP_KEYS.test(e.key)) {
      e.preventDefault();
      storyPause(); storyShow(stepTo(e.key, +mk.dataset.i, story.n), true);
      $("#story").querySelectorAll(".mk")[story.i].focus();
    }
    /* "/" opens search from anywhere (unless typing) */
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const a = document.activeElement;
      if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
      e.preventDefault();
      if (!$("#home").hidden) $("#homeQ").focus(); else openSheet();
    }
  });
  /* Esc in the sheet: first closes suggestions, then the sheet */
  $("#sheet").addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    if ($("#topSug").hidden) { e.stopPropagation(); closeSheet(); }
  }, true);
  $("#sheet").addEventListener("click", e => {
    if (e.target.closest("[data-sheetclose]")) { closeSheet(); return; }
    const b = e.target.closest("[data-sheet]"); if (!b) return;
    if (b.dataset.sheet === "lucky") lucky($("#topQ")); else showDirectory();
  });
  $("#dockHome").addEventListener("click", showHome);
  $("#dockSearch").addEventListener("click", openSheet);
  $("#brandBtn").addEventListener("click", () => { showHome(); $("#homeQ").focus(); });
  $("#dockDir").addEventListener("click", () => showDirectory());
  $("#dockLucky").addEventListener("click", () => lucky($("#homeQ")));

  /* deep links: #bronchiectasis, #bronchiectasis/screener, #fabry-disease/journey, #directory */
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) { showHome(); return; }
    if (h === "directory") { showDirectory(); return; }
    const [key, tab = "about"] = h.split("/");
    if (CUR && CUR.key === key && !$("#page").hidden) { if (tab !== curTab) showTab(tab); return; }
    const it = INDEX.find(x => slug(x.name) === key);
    it ? openItem(it.key, null, [], tab) : go(key.replace(/-/g, " "));
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
    get current() { return CUR; }, get tab() { return curTab; }, openTab, showTab, closeDrawer: () => {}, toast, ic, esc, STATUS, profileText, stageList, find, profileTextOf,
    credentialsFor: (n, g) => US.credentialsFor(n, g),
  };

  /* route once every script (screener, assistant) has loaded */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fromHash); else fromHash();
})();
