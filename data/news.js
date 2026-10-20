/* Rare·Desk home news: what's new in US rare disease (curated; each item links to its source).
   Fields: d date (YYYY-MM-DD, or YYYY-MM when only the month is known) · k kind · t headline · s one-line summary
           · src source name · u source URL · dz directory disease to open (optional)
   watch: upcoming FDA decisions (company-announced target dates; these can move). */
window.NEWS = {
  asOf: "2026-10-20",
  latest: [
    { d: "2026-10-16", k: "approval", t: "Enspryng approved for thyroid eye disease", s: "Roche's satralizumab is the first at-home subcutaneous treatment for TED, approved after priority review.", src: "Roche", u: "https://www.globenewswire.com/news-release/2026/10/16/3382249/0/en/fda-approves-roche-s-enspryng-a-first-in-class-il-6r-inhibitor-as-the-first-and-only-at-home-subcutaneous-treatment-option-for-thyroid-eye-disease-ted.html", dz: "Thyroid eye disease" },
    { d: "2026-10-15", k: "payment", t: "Medicare Part D cap rises to $2,400 in 2027", s: "Up from $2,100 in 2026, with the deductible rising to $700. Open enrollment runs Oct 15 to Dec 7.", src: "Kiplinger", u: "https://www.kiplinger.com/retirement/medicare/changes-coming-to-medicare-in-2027" },
    { d: "2026-10-14", k: "policy", t: "FDA launches a Rare Disease Framework", s: "Review standards tailored to each condition instead of one approach for all. Public kickoff meeting on Oct 28.", src: "BioPharma Dive", u: "https://www.biopharmadive.com/news/fda-rare-disease-framework-initiative-drug-development/833080/" },
    { d: "2026-10-14", k: "deal", t: "Ultragenyx sells a priority review voucher for $203M", s: "The voucher came with its Sanfilippo gene therapy approval and buys a faster FDA review for another drug.", src: "Ultragenyx", u: "https://www.globenewswire.com/news-release/2026/10/14/3380718/20739/en/ultragenyx-enters-into-agreement-to-sell-rare-pediatric-disease-priority-review-voucher-for-203-million.html", dz: "Sanfilippo syndrome" },
    { d: "2026-09", k: "approval", t: "Fayuvi: first therapy for Sanfilippo syndrome type A", s: "Ultragenyx's one-time gene therapy (UX111), priced at $3.95 million per patient in the US.", src: "Bioxconomy", u: "https://www.bioxconomy.com/modalities/fda-approves-gene-therapy-for-ultra-rare-childhood-metabolic-disease-will-cost-4m-per-patient", dz: "Sanfilippo syndrome" },
    { d: "2026-09", k: "approval", t: "Zanvastro: first treatment for Alexander disease", s: "Ionis' zilganersen, an antisense drug given into the spinal fluid.", src: "FDA", u: "https://fda.gov/news-events/press-announcements/fda-approves-first-drug-treat-alexander-disease", dz: "Alexander disease" },
    { d: "2026-08-27", k: "approval", t: "Lisraya: first targeted oral therapy for dermatomyositis", s: "Priovant and Roivant's once-daily brepocitinib, approved on the Phase 3 VALOR trial.", src: "STAT", u: "https://www.statnews.com/2026/08/27/fda-approves-roivant-therapy-for-rare-autoimmune-disease/", dz: "Dermatomyositis" },
    { d: "2026-08-13", k: "screening", t: "HRSA speeds up newborn screening reviews", s: "A new process for adding conditions to the national panel (RUSP), after the federal advisory committee was disbanded in 2025.", src: "HRSA", u: "https://www.hrsa.gov/about/news/press-releases/modernize-newborn-screening-review-process" },
  ],
  watch: [
    { d: "2026-11-22", t: "Molgramostim (Molbreevi)", co: "Savara", for: "Autoimmune PAP", src: "Savara", u: "https://www.businesswire.com/news/home/20260415775650/en", dz: "Autoimmune pulmonary alveolar proteinosis" },
    { d: "2026-11-22", t: "Deramiocel", co: "Capricor", for: "Duchenne cardiomyopathy", src: "Capricor", u: "https://www.capricor.com/investors/news-events/press-releases/detail/354/capricor-therapeutics-announces-extension-of-pdufa-target", dz: "Duchenne muscular dystrophy" },
    { d: "2026-11-25", t: "Venglustat", co: "Sanofi", for: "Type 3 Gaucher (neurological)", src: "Gaucher Disease News", u: "https://gaucherdiseasenews.com/2026/06/01/fda-grants-priority-review-treatment-aimed-type-3-gaucher/", dz: "Gaucher disease" },
    { d: "2026-11-27", t: "BBP-418", co: "BridgeBio", for: "LGMD2I/R9", src: "BridgeBio", u: "https://www.biospace.com/press-releases/bridgebio-announces-fda-acceptance-and-priority-review-of-nda-for-bbp-418-for-lgmd2i-r9", dz: "Limb-girdle muscular dystrophy" },
  ],
};
