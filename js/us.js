/* Rare·Desk US reference data: credentials, care networks, newborn screening, payer pathways, population estimates.
   Facts reviewed October 2026. Verify before citing. */
window.US = (function () {
  const BIRTHS = 3.6e6;   // US births per year (approx.)
  const POP = 335e6;      // US population (approx.)
  const ORPHAN = 200000;  // Orphan Drug Act threshold: fewer than 200,000 people in the US

  /* ---------- Where to verify a credential ---------- */
  const VERIFY = {
    abms: ["ABMS Certification Matters", "https://www.certificationmatters.org"],
    docinfo: ["FSMB DocInfo (license check)", "https://www.docinfo.org"],
    nursys: ["Nursys (nurse license check)", "https://www.nursys.com"],
    nabp: ["NABP (pharmacist licensing)", "https://nabp.pharmacy"],
    bps: ["Board of Pharmacy Specialties", "https://www.bpsweb.org"],
    nbrc: ["NBRC (respiratory therapists)", "https://www.nbrc.org"],
    fsbpt: ["FSBPT (physical therapists)", "https://www.fsbpt.org"],
    nbcot: ["NBCOT (occupational therapists)", "https://www.nbcot.org"],
    asha: ["ASHA (speech & audiology)", "https://www.asha.org"],
    cdr: ["CDR (registered dietitians)", "https://www.cdrnet.org"],
    abgc: ["ABGC (genetic counselors)", "https://www.abgc.net"],
    nsgc: ["NSGC state licensure map", "https://www.nsgc.org"],
    asppb: ["ASPPB (psychologists)", "https://www.asppb.net"],
    aswb: ["ASWB (social workers)", "https://www.aswb.org"],
    nbeo: ["NBEO (optometrists)", "https://www.optometry.org"],
    ada: ["American Dental Association", "https://www.ada.org"],
    abc: ["ABC (orthotists)", "https://www.abcop.org"],
    clia: ["CMS CLIA program", "https://www.cms.gov/medicare/quality/clinical-laboratory-improvement-amendments"],
    cap: ["College of American Pathologists", "https://www.cap.org"],
    fact: ["FACT accreditation", "https://www.factglobal.org"],
    optn: ["OPTN (transplant programs)", "https://optn.transplant.hrsa.gov"],
    fda: ["FDA", "https://www.fda.gov"],
    naic: ["NAIC (insurance regulators)", "https://content.naic.org"],
    cms: ["CMS", "https://www.cms.gov"],
    irs: ["IRS Tax Exempt Organization Search", "https://apps.irs.gov/app/eos/"],
    aabb: ["AABB", "https://www.aabb.org"],
    nmdp: ["NMDP", "https://www.nmdp.org"],
    achc: ["ACHC accreditation", "https://www.achc.org"],
    urac: ["URAC accreditation", "https://www.urac.org"],
    ins: ["Infusion Nurses Society (CRNI)", "https://www.ins1.org"],
    aanp: ["AANP Certification Board", "https://www.aanpcert.org"],
    ancc: ["ANCC certification", "https://www.nursingworld.org/our-certifications/"],
    nccpa: ["NCCPA (physician assistants)", "https://www.nccpa.net"],
    acr: ["ACR accreditation", "https://www.acr.org"],
    idea: ["IDEA (U.S. Dept. of Education)", "https://sites.ed.gov/idea/"],
    hrsa: ["HRSA", "https://www.hrsa.gov"],
  };

  /* ---------- Role → US license & certification ----------
     [pattern, title, required (law), board/certification (voluntary but expected), note, verify keys] */
  const MD = "MD or DO + state medical license (USMLE/COMLEX)";
  const ROLES = [
    [/patient|family|caregiver/, "Patient & family", "", "", "No license involved.", []],
    [/clinical lab|\blab\b|labs\b|laborator|screening lab|newborn screen|gene panel|\bpanels?\b|csf\b|flow cytometry|cytometr|biomarker|adamts13|microbiology|mycobacteriology|enzyme|sputum|porphyria lab|complement|sequenc|genomics/, "Clinical laboratory", "CLIA certificate from CMS for any lab testing human specimens; NY State CLEP permit for New York specimens", "CAP accreditation is common; lab directors are board-certified (ABPath, ABMGG or ABB)", "Newborn screening is run by state public health labs.", ["clia", "cap"]],
    [/cath lab/, "Cardiac catheterization lab", MD, "ABIM: Interventional Cardiology (cardiologists performing catheterization)", "Hospital-based; right-heart catheterization confirms PH.", ["abms", "docinfo"]],
    [/nuclear/, "Nuclear medicine / imaging", MD, "ABNM or ABR", "Medicare requires accreditation (ACR, IAC or TJC) for advanced diagnostic imaging suppliers.", ["abms", "acr"]],
    [/interventional radiolog/, "Interventional radiologist", MD, "ABR: Interventional Radiology", "", ["abms", "docinfo"]],
    [/neuroradiolog|radiolog|imaging|\bmri\b|\bct\b|scan/, "Radiologist / imaging", MD, "ABR: Diagnostic Radiology (+ subspecialty e.g. Neuroradiology)", "Medicare requires accreditation (ACR, IAC or TJC) for advanced imaging suppliers (CT, MRI, PET).", ["abms", "acr"]],
    [/dermatopatholog|hematopatholog|patholog/, "Pathologist", MD, "ABPath (+ subspecialty e.g. Hematopathology, Dermatopathology)", "", ["abms", "docinfo"]],
    [/genetic counsel/, "Genetic counselor", "Master's degree; state license in about 35 states (see NSGC map)", "ABGC certification (CGC)", "Many payers require genetic counseling before covering genetic tests.", ["abgc", "nsgc"]],
    [/metabolic genetic|biochemical genetic|medical genetic|geneticist|genetics\b|metabolic|fabry center/, "Medical geneticist", MD, "ABMGG: Medical Genetics & Genomics (+ Medical Biochemical Genetics for metabolic disease)", "", ["abms", "docinfo"]],
    [/neonatolog|\bnicu\b/, "Neonatologist", MD, "ABP: Pediatrics + Neonatal-Perinatal Medicine", "", ["abms", "docinfo"]],
    [/developmental-behavioral/, "Developmental-behavioral pediatrician", MD, "ABP: Developmental-Behavioral Pediatrics", "", ["abms", "docinfo"]],
    [/pediatric cardiolog|fetal cardiolog/, "Pediatric cardiologist", MD, "ABP: Pediatric Cardiology", "", ["abms", "docinfo"]],
    [/pediatric (hepatolog|gastro)/, "Pediatric gastroenterologist / hepatologist", MD, "ABP: Pediatric Gastroenterology (+ Pediatric Transplant Hepatology)", "", ["abms", "docinfo"]],
    [/pediatric hematolog|pediatric oncolog/, "Pediatric hematologist-oncologist", MD, "ABP: Pediatric Hematology-Oncology", "", ["abms", "docinfo"]],
    [/pediatric endocrin/, "Pediatric endocrinologist", MD, "ABP: Pediatric Endocrinology", "", ["abms", "docinfo"]],
    [/pediatric nephrolog/, "Pediatric nephrologist", MD, "ABP: Pediatric Nephrology", "", ["abms", "docinfo"]],
    [/pediatric surgeon/, "Pediatric surgeon", MD, "ABS: Pediatric Surgery", "", ["abms", "docinfo"]],
    [/child neurolog|pediatric neurolog/, "Child neurologist", MD, "ABPN: Neurology with Special Qualification in Child Neurology", "", ["abms", "docinfo"]],
    [/pediatrician|pediatrics/, "Pediatrician", MD, "ABP: Pediatrics", "", ["abms", "docinfo"]],
    [/\bpcp\b|primary care|family physician|internist|internal medicine|\bgp\b/, "Primary care physician", MD, "ABFM (Family Medicine) or ABIM (Internal Medicine)", "Often the referral gatekeeper in HMO plans.", ["abms", "docinfo"]],
    [/ph specialist|ph care center/, "Pulmonary hypertension specialist", MD, "ABIM: Pulmonary Disease or Cardiovascular Disease", "Centers can be accredited by the Pulmonary Hypertension Association (voluntary).", ["abms", "docinfo"]],
    [/pulmonolog|ild center|\bpulmonary\b|lung clinic|pap center/, "Pulmonologist", MD, "ABIM: Internal Medicine + Pulmonary Disease (often + Critical Care Medicine)", "", ["abms", "docinfo"]],
    [/electrophysiolog/, "Cardiac electrophysiologist", MD, "ABIM: Clinical Cardiac Electrophysiology", "", ["abms", "docinfo"]],
    [/cardiolog|cardiac\b|heart/, "Cardiologist", MD, "ABIM: Cardiovascular Disease (+ Advanced Heart Failure & Transplant Cardiology)", "", ["abms", "docinfo"]],
    [/hemophilia treatment center|\bhtc\b/, "Hemophilia treatment center (HTC)", "Team of licensed clinicians (hematologist, nurse, PT, social worker)", "Part of the federally supported HTC network (HRSA/CDC); HTCs are 340B covered entities", "", ["hrsa"]],
    [/hematolog|thalassemia center|amyloidosis center/, "Hematologist", MD, "ABIM: Hematology (often + Medical Oncology)", "", ["abms", "docinfo"]],
    [/sarcoma|oncolog/, "Oncologist", MD, "ABIM: Medical Oncology (sarcoma oncologists are usually at NCI-designated centers)", "", ["abms", "docinfo"]],
    [/nephrolog|kidney/, "Nephrologist", MD, "ABIM: Nephrology", "Dialysis facilities are separately certified by CMS.", ["abms", "docinfo"]],
    [/transplant hepatolog/, "Transplant hepatologist", MD, "ABIM: Transplant Hepatology", "", ["abms", "docinfo"]],
    [/hepatolog|liver/, "Hepatologist", MD, "ABIM: Gastroenterology (+ Transplant Hepatology)", "", ["abms", "docinfo"]],
    [/gastroenterolog|\bgastro\b|\bgi\b/, "Gastroenterologist", MD, "ABIM: Gastroenterology", "", ["abms", "docinfo"]],
    [/rheumatolog/, "Rheumatologist", MD, "ABIM: Rheumatology", "", ["abms", "docinfo"]],
    [/endocrinolog|bone & mineral|\bfop specialist/, "Endocrinologist", MD, "ABIM: Endocrinology, Diabetes & Metabolism (or ABP: Pediatric Endocrinology)", "", ["abms", "docinfo"]],
    [/lipidolog/, "Lipidologist", MD, "Usually ABIM Cardiology or Endocrinology; optional American Board of Clinical Lipidology (not an ABMS board)", "", ["abms", "docinfo"]],
    [/allerg|immunolog(?!y lab)/, "Allergist / immunologist", MD, "ABAI: Allergy & Immunology", "Clinical immunologists who manage immune deficiency hold this board.", ["abms", "docinfo"]],
    [/infectious disease|\bid specialist/, "Infectious disease specialist", MD, "ABIM: Infectious Disease", "", ["abms", "docinfo"]],
    [/epileptolog/, "Epileptologist", MD, "ABPN: Neurology + Epilepsy subspecialty", "Level 3–4 epilepsy centers are accredited by NAEC (voluntary).", ["abms", "docinfo"]],
    [/neuromuscular/, "Neuromuscular neurologist", MD, "ABPN: Neurology + Neuromuscular Medicine", "MDA Care Centers are a common multidisciplinary model.", ["abms", "docinfo"]],
    [/neuro-ophthalmolog/, "Neuro-ophthalmologist", MD, "ABO or ABPN (fellowship-trained; no separate board)", "", ["abms", "docinfo"]],
    [/autonomic/, "Autonomic neurologist", MD, "ABPN: Neurology (+ autonomic certification from UCNS, optional)", "", ["abms", "docinfo"]],
    [/neurosurg/, "Neurosurgeon", MD, "ABNS: Neurological Surgery", "", ["abms", "docinfo"]],
    [/neurolog|\bhd clinic|\bals clinic/, "Neurologist", MD, "ABPN: Neurology", "", ["abms", "docinfo"]],
    [/psychiatr/, "Psychiatrist", MD, "ABPN: Psychiatry (+ Child & Adolescent Psychiatry)", "", ["abms", "docinfo"]],
    [/psycholog/, "Psychologist", "Doctoral degree (PhD/PsyD), EPPP exam and state psychology license", "Optional ABPP board certification", "", ["asppb"]],
    [/dermatolog/, "Dermatologist", MD, "ABD: Dermatology (+ Pediatric Dermatology)", "", ["abms", "docinfo"]],
    [/optometr/, "Optometrist", "OD degree, NBEO exams and state optometry license", "Every state lets optometrists prescribe topical eye drugs; exact scope varies by state", "Optometrists often diagnose and treat eyelid disease such as Demodex blepharitis.", ["nbeo"]],
    [/retina|cornea|oculoplastic|ophthalmolog|\beye\b/, "Ophthalmologist", MD, "ABO: Ophthalmology (retina, cornea and oculoplastics are fellowships, no separate board)", "", ["abms", "docinfo"]],
    [/audiolog|hearing/, "Audiologist", "AuD + state audiology license", "ASHA CCC-A or ABA certification", "", ["asha"]],
    [/\bent\b|otolaryngolog/, "Otolaryngologist (ENT)", MD, "ABOto: Otolaryngology–Head & Neck Surgery", "", ["abms", "docinfo"]],
    [/hand surgeon|hand &/, "Hand surgeon / hand therapist", "Surgeons: MD/DO + license; hand therapists: OT or PT license", "Surgery of the Hand (ABOS/ABS/ABPS); therapists: CHT credential (optional)", "", ["abms", "nbcot"]],
    [/orthotist|orthotic/, "Orthotist", "State license in some states", "ABC certification (CO)", "", ["abc"]],
    [/orthoped|\bortho\b|spine surgeon/, "Orthopedic surgeon", MD, "ABOS: Orthopaedic Surgery", "", ["abms", "docinfo"]],
    [/thoracic surgeon|cardiothoracic|chest surgeon|pea surgeon|cardiac surgeon/, "Cardiothoracic surgeon", MD, "ABTS: Thoracic Surgery", "", ["abms", "docinfo"]],
    [/vascular/, "Vascular surgeon / specialist", MD, "ABS: Vascular Surgery (vascular medicine physicians: ABVM, not an ABMS board)", "", ["abms", "docinfo"]],
    [/transplant center|transplant team|transplant \/|gene therapy center|bmt|hsct|stem cell|transplant/, "Transplant / gene therapy center", "Solid-organ programs: OPTN membership + CMS approval. HSCT and cell therapy programs: FACT accreditation (expected by payers)", "Gene therapies are given only at manufacturer-qualified treatment centers", "Physicians hold hematology-oncology (ABIM/ABP) or transplant surgery (ABS) boards.", ["optn", "fact"]],
    [/urolog/, "Urologist", MD, "ABU: Urology", "", ["abms", "docinfo"]],
    [/ob\/gyn|\bob\b|obstetric|gynecolog|maternal-fetal|\bmfm\b|fertility/, "OB/GYN / maternal-fetal medicine", MD, "ABOG: Obstetrics & Gynecology (+ Maternal-Fetal Medicine or REI)", "", ["abms", "docinfo"]],
    [/emergency|\bed\b|\ber\b/, "Emergency physician", MD, "ABEM: Emergency Medicine", "", ["abms", "docinfo"]],
    [/\bicu\b|intensiv|critical care/, "Intensivist", MD, "Critical Care Medicine subspecialty (ABIM, ABA, ABS, ABEM or ABP)", "", ["abms", "docinfo"]],
    [/palliative|hospice/, "Palliative care", MD + "; nurses hold RN licenses", "Hospice & Palliative Medicine subspecialty", "Hospice programs are Medicare-certified.", ["abms", "cms"]],
    [/sleep/, "Sleep medicine physician", MD, "Sleep Medicine subspecialty (ABIM, ABPN, ABP, ABFM or ABOto)", "", ["abms", "docinfo"]],
    [/surgeon|surgery/, "Surgeon", MD, "ABS: Surgery (+ subspecialty)", "", ["abms", "docinfo"]],
    [/respiratory therap|respiratory &|airway clearance/, "Respiratory therapist", "NBRC credential (CRT or RRT) + state license: all 50 states (Alaska's law enacted 2026)", "RRT is the advanced credential; ACCS/NPS specialty credentials optional", "Often teaches airway clearance and runs pulmonary rehab.", ["nbrc"]],
    [/physical therap|\bpt\b|physical &|physio/, "Physical therapist", "DPT degree, NPTE exam (FSBPT) and state license", "Optional ABPTS specialist certification (e.g. neurologic, pediatric)", "", ["fsbpt"]],
    [/occupational|\bot\b/, "Occupational therapist", "NBCOT exam (OTR) + state license", "", "", ["nbcot"]],
    [/speech/, "Speech-language pathologist", "Master's degree + state license", "ASHA CCC-SLP", "", ["asha"]],
    [/dietitian|nutrition/, "Registered dietitian", "Licensure or certification in most states", "CDR credential (RD/RDN); metabolic dietitians often hold extra training", "", ["cdr"]],
    [/nurse practitioner|\bnp\b/, "Nurse practitioner", "RN license + APRN license", "National certification (AANP, ANCC or PNCB)", "", ["aanp", "ancc", "nursys"]],
    [/home infusion|infusion nurse|infusion team|infusion center|infusion/, "Home infusion / infusion nurse", "RN license (NCLEX-RN)", "Optional CRNI certification; Medicare home infusion therapy suppliers must be accredited (e.g. ACHC, CHAP, TJC)", "", ["nursys", "ins", "achc"]],
    [/wound|\beb nurse/, "Wound care nurse", "RN license", "Optional WOCNCB certification", "", ["nursys"]],
    [/nurse|nursing|\brn\b/, "Nurse", "RN license (NCLEX-RN); multistate under the Nurse Licensure Compact in most states", "Optional specialty certifications", "", ["nursys"]],
    [/specialty pharmac/, "Specialty pharmacy", "State pharmacy license (and pharmacist licenses)", "URAC or ACHC specialty pharmacy accreditation, usually required by payers and manufacturers", "Rare disease drugs are often in limited distribution networks.", ["urac", "achc", "nabp"]],
    [/pharmacist|pharmacy/, "Pharmacist", "PharmD, NAPLEX + MPJE exams and state license", "Optional BPS board certification (e.g. BCPS)", "", ["nabp", "bps"]],
    [/dentist|dental/, "Dentist", "DDS/DMD, INBDE exam and state dental license", "", "", ["ada"]],
    [/social work|social services/, "Social worker", "State license (LCSW for clinical work)", "ASWB exam", "", ["aswb"]],
    [/early intervention|developmental services|developmental team|developmental &/, "Early intervention services", "State IDEA Part C program; providers hold their own licenses (PT, OT, SLP, special education)", "", "Free evaluation for children under 3 in every state.", ["idea"]],
    [/school|\biep\b|teacher|education/, "Schools (IEP)", "IDEA Part B; special educators are state-certified", "", "", ["idea"]],
    [/child protective|\bcps\b/, "Child protective services", "State agency", "", "", []],
    [/low-vision/, "Low-vision rehabilitation", "Optometrist or ophthalmologist license; therapists vary by state", "Optional CLVT certification (ACVREP)", "", []],
    [/apheresis/, "Apheresis unit", "Hospital service run by licensed physicians and nurses", "Follows AABB standards and ASFA guidelines", "", ["aabb"]],
    [/blood center/, "Blood centers", "FDA-licensed blood establishment (CBER)", "AABB accreditation", "", ["fda", "aabb"]],
    [/donor regist|\bnmdp\b/, "Donor registry", "NMDP runs the national registry under HRSA's C.W. Bill Young Program", "", "", ["nmdp"]],
    [/skilled nursing|long-term care|nursing home/, "Skilled nursing / long-term care", "State facility license + CMS certification for Medicare/Medicaid", "", "", ["cms"]],
    [/medical food/, "Medical food suppliers", "FDA-regulated medical foods (no premarket approval)", "", "Coverage depends on state mandates and plan type.", ["fda"]],
    [/\bicer\b/, "ICER", "Independent nonprofit; no license", "", "Publishes value assessments payers use in negotiations.", []],
    [/payer|insur|\bpbm|medicare|medicaid|\bcms\b|part d/, "Payers & PBMs", "Insurers licensed by state insurance departments; Medicare Advantage and Part D sponsors contract with CMS; many states license or register PBMs", "", "", ["naic", "cms"]],
    [/registry|registries|consortium|research network|researchers|trial/, "Research networks", "IRB oversight (45 CFR 46); FDA IND for interventional trials", "", "", ["fda"]],
    [/physician assistant|\bpa\b/, "Physician assistant", "NCCPA exam (PA-C) + state license", "", "", ["nccpa"]],
    [/pain/, "Pain medicine physician", MD, "Pain Medicine subspecialty (ABA, ABPN or ABPMR)", "", ["abms", "docinfo"]],
    [/mental health/, "Mental health clinicians", "Psychiatrists (MD/DO), psychologists and counselors (LPC) each need a state license", "ABPN for psychiatrists", "", ["abms", "asppb"]],
    [/transfusion/, "Hospital transfusion service", "Hospital blood bank under CLIA and FDA blood rules", "AABB accreditation common", "", ["aabb", "clia"]],
    [/stool color|public health|screening program/, "Public health screening program", "Run by state health departments", "", "", ["hrsa"]],
    [/behavio(u)?r support|behavio(u)?r analyst/, "Behavior analyst", "State license in many states", "BACB certification (BCBA)", "", []],
    [/residential|group home/, "Residential care", "State license; ICF/IID homes are CMS-certified under Medicaid", "", "", ["cms"]],
    [/rehab|oxygen|\bdme\b|durable medical/, "Pulmonary rehab & DME suppliers", "Medicare DMEPOS suppliers (oxygen, vests) must be accredited", "Pulmonary rehab programs may hold AACVPR certification (optional)", "", ["cms"]],
    [/cf care center|\bcff\b/, "CF care center", "Licensed clinicians (pulmonologist, RT, dietitian, social worker)", "Accredited by the Cystic Fibrosis Foundation", "", []],
    [/\bpcd\b/, "PCD diagnostic center", "CLIA-certified specialty testing + pulmonologists", "Part of the PCD Foundation network", "", ["clia"]],
    [/therap(y|ies)\b|therapists/, "Therapists (PT, OT, speech)", "Each therapist holds a state license (PT, OT or SLP)", "NPTE / NBCOT / ASHA CCC-SLP", "", ["fsbpt", "nbcot", "asha"]],
    [/specialist|clinic|center|team/, "Specialist team", MD, "Board certification in the relevant ABMS specialty", "", ["abms", "docinfo"]],
  ];
  const COMPANY = /pharma|biotech|therapeutics|\bbio\b|biosciences|sobi|\bucb\b|novartis|roche|genentech|sanofi|takeda|amgen|alexion|astrazeneca|pfizer|regeneron|vertex|biogen|ionis|alnylam|insmed|chiesi|ipsen|ultragenyx|biomarin|sarepta|argenx|jazz|neurocrine|acadia|soleno|rhythm|crinetics|recordati|catalyst|immedica|marinus|egetis|intrabio|zevra|denali|rocket|stealth|savara|travere|calliditas|otsuka|bayer|merck|gsk|johnson|j&j|lilly|novo|\bcsl\b|grifols|octapharma|bluebird|orchard|kyowa|krystal|abeona|mirum|clinuvel|disc medicine|apellis|agios|rigel|domp|nanoscope|meiragtx|edgewise|avidity|dyne|larimar|immunome|springworks|tarsus|pharming|\bx4\b|eton|sentynl|spark|uniqure|capricor|haisco|zambon|proaxsis|electromed|baxter|hillrom|lundbeck|shionogi|stoke|taysha|neurogene|bridgebio|belite|alkeus|ironwood|chemomab|genethon|telethon|minoryx|lexeo|kalvista|biocryst|intellia|arrowhead|vera\b|sumitomo|bristol|medical food|ig makers|ig manufacturers|plasma|device|manufacturer|companies|makers/i;
  const ACRONYM = /^[A-Z][A-Z&-]{1,9}$/;
  const ORG_WORDS = /hope\b|partners|all things|answering|prisms|\bnord\b|people of america|foundation|association|society|alliance|network|organization|project|coalition|trust|federation|\bnord\b|\bmda\b|\bcdcn\b|ifopa|\bpha\b|\bprf\b|\birsf\b|\brsrt\b|\bfast\b|\bfara\b|\bfrax|research|support|parents|community|connect|initiative|\bcure\b|cure |patient org/i;
  const MAKER = ["Manufacturer", "FDA approval (NDA/BLA), establishment registration and cGMP; state manufacturer/distributor licenses", "", "Must report adverse events heard in market research to the FDA (pharmacovigilance).", ["fda"]];
  const ADVOCACY = ["Patient / advocacy organization", "No license; usually a 501(c)(3) nonprofit", "", "Check nonprofit status in the IRS database.", ["irs"]];

  function splitRole(name) {
    return String(name).split(/\s+\/\s+|\s*&\s*|,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean);
  }
  function credentialsFor(name, group) {
    const lower = String(name).toLowerCase();
    if (group === "patient") return [];
    const card = (title, kind, req, board, note, verify) => ({ title, kind, req, board, note, verify });
    if (group === "sys" && !/payer|pbm|medicare|medicaid|icer|newborn|registry|blood|donor|school|services|researchers|trial/i.test(name)) {
      if (COMPANY.test(name)) return [card(name, ...MAKER)];
      if (ORG_WORDS.test(name) || ACRONYM.test(name.trim())) return [card(name, ...ADVOCACY)];
    }
    const out = [], seen = new Set();
    const tryMatch = (txt) => {
      for (const [re, title, req, board, note, ver] of ROLES) {
        if (re.test(txt)) {
          if (!seen.has(title)) { seen.add(title); out.push(card(title, "US requirement", req, board, note, ver)); }
          return true;
        }
      }
      return false;
    };
    const parts = splitRole(lower);
    if (parts.length > 1) parts.forEach(tryMatch); else tryMatch(lower);
    if (!out.length) tryMatch(lower);
    if (!out.length) {
      if (group === "sys") return [card(name, ...(COMPANY.test(name) ? MAKER : ADVOCACY))];
      return [card(name, "US requirement", "Check the state licensing board for this role", "", "", ["docinfo"])];
    }
    return out.filter(c => c.title !== "Patient & family");
  }

  /* ---------- Newborn screening (RUSP) ---------- */
  const RUSP = {
    "Phenylketonuria": ["core", "RUSP core condition"],
    "Maple syrup urine disease": ["core", "RUSP core condition"],
    "Homocystinuria": ["core", "RUSP core condition"],
    "Congenital adrenal hyperplasia": ["core", "RUSP core condition"],
    "Cystic fibrosis": ["core", "RUSP core condition"],
    "Sickle cell disease": ["core", "RUSP core (Hb SS, S/β-thal, S/C)"],
    "Severe combined immunodeficiency": ["core", "RUSP core since 2010 (TREC test)"],
    "Pompe disease": ["core", "RUSP core since 2015"],
    "Mucopolysaccharidosis type I": ["core", "RUSP core since 2016"],
    "X-linked adrenoleukodystrophy": ["core", "RUSP core since 2016"],
    "Spinal muscular atrophy": ["core", "RUSP core since 2018"],
    "Hunter syndrome": ["core", "RUSP core since 2022"],
    "Krabbe disease": ["core", "RUSP core since 2024 (infantile form)"],
    "Duchenne muscular dystrophy": ["core", "Added to RUSP Dec 2025; few states screen yet"],
    "Metachromatic leukodystrophy": ["core", "Added to RUSP Dec 2025; few states screen yet"],
    "Arginase 1 deficiency": ["secondary", "RUSP secondary condition"],
    "Beta thalassemia": ["secondary", "Found through hemoglobinopathy screening (secondary)"],
    "Fabry disease": ["state", "A few state panels only (not on RUSP)"],
    "Gaucher disease": ["state", "A few state panels only (not on RUSP)"],
    "22q11.2 deletion syndrome": ["state", "Sometimes flagged by SCID (TREC) screening"],
    "Aromatic L-amino acid decarboxylase deficiency": ["state", "Pilot studies only"],
    "Biliary atresia": ["state", "Stool color cards in some programs (not RUSP)"],
  };
  const NBS_CONTEXT = "The federal advisory committee (ACHDNC) was disbanded in April 2025; HRSA set up a new review workgroup in August 2026. Each state decides what it screens.";
  function nbs(name) {
    const r = RUSP[name];
    return r ? { level: r[0], text: r[1] } : { level: "none", text: "Not on the RUSP newborn panel" };
  }

  /* ---------- US care center networks ---------- */
  const NET = {
    cff: ["CF Foundation–accredited care centers", "130+ accredited CF care programs", "https://www.cff.org"],
    htc: ["Hemophilia treatment centers (HTCs)", "~140 federally supported HTCs; 340B covered entities", "https://www.cdc.gov/hemophilia/"],
    pha: ["PHA-accredited PH care centers", "Accredited by the Pulmonary Hypertension Association", "https://phassociation.org"],
    als: ["ALS Association Certified Treatment Centers of Excellence", "Multidisciplinary ALS clinics", "https://www.als.org"],
    mda: ["MDA Care Center network", "150+ multidisciplinary neuromuscular clinics", "https://www.mda.org"],
    ppmd: ["PPMD Certified Duchenne Care Centers", "Certified against care guidelines", "https://www.parentprojectmd.org"],
    hdsa: ["HDSA Centers of Excellence", "Multidisciplinary Huntington's disease clinics", "https://hdsa.org"],
    alpha1: ["Alpha-1 Foundation Clinical Resource Centers", "Specialist AATD clinics", "https://www.alpha1.org"],
    pcd: ["PCD Foundation Clinical & Research Centers Network", "PCD diagnostic and care centers", "https://www.pcdfoundation.org"],
    lam: ["LAM Foundation clinics", "Designated LAM clinics", "https://www.thelamfoundation.org"],
    pff: ["PFF Care Center Network", "Pulmonary fibrosis care centers", "https://www.pulmonaryfibrosis.org"],
    brr: ["Bronchiectasis & NTM Research Registry sites", "COPD Foundation registry network", "https://www.copdfoundation.org"],
    tsc: ["TSC Alliance clinics", "Recognized TSC clinics", "https://www.tscalliance.org"],
    rett: ["IRSF Rett Syndrome Centers of Excellence", "Rett-specialist clinics", "https://www.rettsyndrome.org"],
    nf: ["Children's Tumor Foundation NF Clinic Network", "NF specialty clinics", "https://www.ctf.org"],
    hht: ["Cure HHT Centers of Excellence", "HHT specialty centers", "https://curehht.org"],
    fx: ["Fragile X Clinical & Research Consortium", "Fragile X clinics (NFXF)", "https://fragilex.org"],
    jmf: ["Jeffrey Modell Diagnostic & Research Centers", "Immune deficiency centers", "https://www.info4pi.org"],
    nci: ["NCI-designated cancer centers (sarcoma programs)", "Expert sarcoma multidisciplinary teams", "https://www.cancer.gov/research/infrastructure/cancer-centers"],
    qtc: ["Qualified treatment centers for gene therapy", "Manufacturer-designated, usually FACT-accredited", "https://www.factglobal.org"],
    cgt: ["CMS Cell & Gene Therapy Access Model", "Medicaid outcomes-based access in 33 states + DC + PR", "https://www.cms.gov/priorities/innovation/innovation-models/cgt"],
    nord: ["NORD Rare Disease Centers of Excellence", "40+ academic centers designated by NORD", "https://rarediseases.org"],
  };
  const NETWORK_BY = {
    "Cystic fibrosis": ["cff"], "Hemophilia A": ["htc"], "Hemophilia B": ["htc"],
    "Pulmonary arterial hypertension": ["pha"], "Chronic thromboembolic pulmonary hypertension": ["pha"],
    "Amyotrophic lateral sclerosis": ["als", "mda"], "Duchenne muscular dystrophy": ["ppmd", "mda"],
    "Huntington's disease": ["hdsa"], "Alpha-1 antitrypsin deficiency": ["alpha1"], "Primary ciliary dyskinesia": ["pcd"],
    "Lymphangioleiomyomatosis": ["lam"], "Idiopathic pulmonary fibrosis": ["pff"], "Bronchiectasis": ["brr"],
    "Nontuberculous mycobacterial lung disease": ["brr"], "Tuberous sclerosis complex": ["tsc"], "Rett syndrome": ["rett"],
    "Neurofibromatosis type 1": ["nf"], "Hereditary hemorrhagic telangiectasia": ["hht"], "Fragile X syndrome": ["fx"],
    "Desmoid tumor": ["nci"], "Sickle cell disease": ["cgt"],
  };
  const MDA_DISEASES = ["Spinal muscular atrophy", "Becker muscular dystrophy", "Myotonic dystrophy type 1", "Facioscapulohumeral muscular dystrophy",
    "Myasthenia gravis", "Friedreich ataxia", "Charcot-Marie-Tooth disease", "Limb-girdle muscular dystrophy", "Pompe disease",
    "Chronic inflammatory demyelinating polyneuropathy", "Lambert-Eaton myasthenic syndrome"];
  function networks(name, cat, hasGeneTherapy) {
    const keys = [...(NETWORK_BY[name] || [])];
    if (MDA_DISEASES.includes(name) && !keys.includes("mda")) keys.push("mda");
    if (cat === "immuno" && !keys.includes("jmf")) keys.push("jmf");
    if (hasGeneTherapy && !keys.includes("qtc")) keys.push("qtc");
    keys.push("nord");
    return keys.map(k => NET[k]);
  }

  /* ---------- US population estimate from the prevalence text ---------- */
  const num = s => Number(String(s).replace(/,/g, ""));
  function round2(n) {
    if (n >= 1e6) return (Math.round(n / 1e5) / 10) + " million";
    const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1));
    return Math.round(n / p) * p;
  }
  const fmt = n => typeof n === "string" ? n : Number(n).toLocaleString("en-US");
  function range(lo, hi) {
    const a = fmt(round2(lo)), b = fmt(round2(hi));
    return a === b ? a : a + "–" + b;
  }
  function estimate(e) {
    if (e.us) {
      const m = String(e.us).replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(million)?/);
      const n = m ? Number(m[1]) * (m[2] ? 1e6 : 1) : null;
      return { text: e.us, n, kind: "people", source: "cited" };
    }
    const p = String(e.p || "");
    if (/ultra-rare/i.test(p)) return { text: "Ultra-rare in the US", n: 1000, kind: "people", source: "label" };
    let m = p.match(/^~?([\d,]+)(?:\s*[–-]\s*([\d,]+))?\s*(?:people )?in (?:the )?US\b/i);
    if (m) return { text: "≈ " + range(num(m[1]), m[2] ? num(m[2]) : num(m[1])) + " people in the US", n: num(m[1]), nMax: m[2] ? num(m[2]) : num(m[1]), kind: "people", source: "cited" };
    m = p.match(/^~?([\d,]+)(?:\s*[–-]\s*([\d,]+))?\s*US cases\s*\/\s*yr/i);
    if (m) return { text: "≈ " + range(num(m[1]), m[2] ? num(m[2]) : num(m[1])) + " new US cases a year", n: null, kind: "incidence", source: "cited" };
    m = p.match(/^<\s*1 (?:in ([\d,]+)|per million)/i);
    if (m) { const n = m[1] ? POP / num(m[1]) : POP / 1e6; return { text: "Fewer than ≈ " + fmt(round2(n)) + " people in the US", n, nMax: n, kind: "people", source: "calc" }; }
    m = p.match(/^~?1 in ([\d,]+)(?:\s*[–-]\s*([\d,]+))?\s*(male |female )?(births?)?/i);
    if (m) {
      const n1 = num(m[1]), n2 = m[2] ? num(m[2]) : n1;
      if (m[4]) {
        const base = m[3] ? BIRTHS / 2 : BIRTHS;
        return { text: "≈ " + range(base / n2, base / n1) + " US births a year", n: null, kind: "births", source: "calc" };
      }
      return { text: "≈ " + range(POP / n2, POP / n1) + " people in the US", n: POP / n2, nMax: POP / n1, kind: "people", source: "calc" };
    }
    m = p.match(/^~?([\d.]+)(?:\s*[–-]\s*([\d.]+))?\s*per (million|100,000|10,000)(\s*(?:\/\s*yr|per year|births))?/i);
    if (m) {
      const denom = { "million": 1e6, "100,000": 1e5, "10,000": 1e4 }[m[3].toLowerCase()];
      const lo = Number(m[1]), hi = m[2] ? Number(m[2]) : lo;
      const tail = (m[4] || "").toLowerCase();
      if (tail.includes("birth")) return { text: "≈ " + range(BIRTHS * lo / denom, BIRTHS * hi / denom) + " US births a year", n: null, kind: "births", source: "calc" };
      if (tail.includes("yr") || tail.includes("year")) return { text: "≈ " + range(POP * lo / denom, POP * hi / denom) + " new US cases a year", n: null, kind: "incidence", source: "calc" };
      return { text: "≈ " + range(POP * lo / denom, POP * hi / denom) + " people in the US", n: POP * lo / denom, nMax: POP * hi / denom, kind: "people", source: "calc" };
    }
    return null;
  }
  function orphanStatus(e, est) {
    if (e.common) return { level: "common", text: "Common, not rare in the US" };
    if (/ultra-rare/i.test(e.p || "")) return { level: "rare", text: "Rare in the US (<200,000)" };
    if (!est || est.kind !== "people" || est.n == null) return null;
    const hi = est.nMax || est.n;
    if (hi < ORPHAN) return { level: "rare", text: "Rare in the US (<200,000)" };
    if (est.n > ORPHAN) return { level: "above", text: "Above the US orphan threshold" };
    return { level: "border", text: "Near the US orphan threshold" };
  }

  /* ---------- Age group & payer emphasis ----------
     Typical age at diagnosis / living patient population in the US: peds (childhood), adult (working age), older (mostly diagnosed after 60). */
  const AGE = {
    older: ["Bronchiectasis", "Alpha-1 antitrypsin deficiency", "ANCA-associated vasculitis", "IgG4-related disease", "VEXAS syndrome",
      "Amyotrophic lateral sclerosis", "Lambert-Eaton myasthenic syndrome", "Multiple system atrophy", "Progressive supranuclear palsy",
      "Cold agglutinin disease", "AL amyloidosis", "Idiopathic pulmonary fibrosis", "Chronic thromboembolic pulmonary hypertension",
      "Nontuberculous mycobacterial lung disease", "Transthyretin amyloid cardiomyopathy", "Hereditary transthyretin amyloidosis",
      "Demodex blepharitis", "Neurotrophic keratitis"],
    adult: ["Common variable immunodeficiency", "Hereditary angioedema", "GATA2 deficiency", "Hemophagocytic lymphohistiocytosis", "Still's disease",
      "Systemic sclerosis", "Dermatomyositis", "Eosinophilic granulomatosis with polyangiitis", "Hypereosinophilic syndrome", "Takayasu arteritis",
      "Relapsing polychondritis", "Behçet's disease", "Idiopathic multicentric Castleman disease", "Gaucher disease", "Fabry disease", "Pompe disease",
      "Wilson disease", "Acute hepatic porphyria", "Erythropoietic protoporphyria", "Familial chylomicronemia syndrome", "Becker muscular dystrophy",
      "Myotonic dystrophy type 1", "Facioscapulohumeral muscular dystrophy", "Myasthenia gravis", "Chronic inflammatory demyelinating polyneuropathy",
      "Charcot-Marie-Tooth disease", "Limb-girdle muscular dystrophy", "Huntington's disease", "Leber hereditary optic neuropathy", "Stiff person syndrome",
      "Neuromyelitis optica spectrum disorder", "Primary mitochondrial disease", "Paroxysmal nocturnal hemoglobinuria", "Hereditary hemorrhagic telangiectasia",
      "Atypical hemolytic uremic syndrome", "Thrombotic thrombocytopenic purpura", "Aplastic anemia", "Immune thrombocytopenia", "Systemic mastocytosis",
      "Pulmonary arterial hypertension", "Lymphangioleiomyomatosis", "Autoimmune pulmonary alveolar proteinosis", "IgA nephropathy", "C3 glomerulopathy",
      "Focal segmental glomerulosclerosis", "Autosomal dominant polycystic kidney disease", "Acromegaly", "Cushing's disease", "Hypoparathyroidism",
      "Marfan syndrome", "Vascular Ehlers-Danlos syndrome", "Pemphigus vulgaris", "Generalized pustular psoriasis", "Arrhythmogenic right ventricular cardiomyopathy",
      "Primary biliary cholangitis", "Primary sclerosing cholangitis", "Short bowel syndrome", "Retinitis pigmentosa", "Stargardt disease", "Choroideremia",
      "Thyroid eye disease", "Desmoid tumor"],
    peds: ["X-linked agammaglobulinemia", "Severe combined immunodeficiency", "Chronic granulomatous disease", "Wiskott-Aldrich syndrome",
      "22q11.2 deletion syndrome", "Activated PI3K delta syndrome", "WHIM syndrome", "Leukocyte adhesion deficiency type I",
      "Severe congenital neutropenia", "Hyper-IgE syndrome", "Autoimmune polyendocrine syndrome type 1", "Autoimmune lymphoproliferative syndrome",
      "Familial Mediterranean fever", "Cryopyrin-associated periodic syndromes", "TNF receptor-associated periodic syndrome",
      "Mucopolysaccharidosis type I", "Hunter syndrome", "Sanfilippo syndrome", "Morquio A syndrome", "Maroteaux-Lamy syndrome", "Sly syndrome",
      "Niemann-Pick disease type C", "Acid sphingomyelinase deficiency", "Metachromatic leukodystrophy", "Krabbe disease",
      "X-linked adrenoleukodystrophy", "CLN2 Batten disease", "Alpha-mannosidosis", "Lysosomal acid lipase deficiency", "Cystinosis",
      "Phenylketonuria", "Maple syrup urine disease", "Ornithine transcarbamylase deficiency", "Arginase 1 deficiency", "Homocystinuria",
      "Menkes disease", "Primary hyperoxaluria", "Hypophosphatasia", "Glycogen storage disease type Ia", "Barth syndrome",
      "Homozygous familial hypercholesterolemia", "Generalized lipodystrophy", "Spinal muscular atrophy", "Duchenne muscular dystrophy",
      "Friedreich ataxia", "Rett syndrome", "Dravet syndrome", "Lennox-Gastaut syndrome", "Tuberous sclerosis complex", "Angelman syndrome",
      "Fragile X syndrome", "Prader-Willi syndrome", "CDKL5 deficiency disorder", "Neurofibromatosis type 1",
      "Aromatic L-amino acid decarboxylase deficiency", "Alexander disease", "Ataxia-telangiectasia", "MCT8 deficiency", "Sickle cell disease",
      "Beta thalassemia", "Hemophilia A", "Hemophilia B", "Pyruvate kinase deficiency", "Diamond-Blackfan anemia", "Fanconi anemia",
      "Cystic fibrosis", "Primary ciliary dyskinesia", "Alport syndrome", "Congenital adrenal hyperplasia", "X-linked hypophosphatemia",
      "Achondroplasia", "Osteogenesis imperfecta", "Fibrodysplasia ossificans progressiva", "Congenital hyperinsulinism", "Turner syndrome",
      "Bardet-Biedl syndrome", "Epidermolysis bullosa", "Xeroderma pigmentosum", "Congenital ichthyosis", "Hutchinson-Gilford progeria syndrome",
      "Progressive familial intrahepatic cholestasis", "Alagille syndrome", "Biliary atresia", "Crigler-Najjar syndrome", "Danon disease",
      "RPE65-associated retinal dystrophy", "Williams syndrome", "Cornelia de Lange syndrome", "Noonan syndrome", "Smith-Magenis syndrome",
      "Phelan-McDermid syndrome", "Kabuki syndrome", "CHARGE syndrome"],
  };
  const AGE_OF = {};
  for (const [g, list] of Object.entries(AGE)) for (const n of list) AGE_OF[n] = g;
  function ageGroup(P) {
    if (AGE_OF[P.name]) return AGE_OF[P.name];
    const t = ((P.stages || []).slice(0, 2).map(s => s.n + " " + s.d.join(" ")).join(" ") + " " + (P.ageHint || "")).toLowerCase();
    if (/\b(60s|70s|80s)\b|later life|older adults|65\+/.test(t)) return "older";
    if (/birth|newborn|infan|prenatal|toddler|childhood|\bchild|school|teens/.test(t)) return "peds";
    return "adult";
  }
  /* Payer emphasis shown on the dashboard, with US-specific exceptions */
  const PAYER_SPECIAL = {
    "Sickle cell disease": ["Medicaid & CHIP", "About half of people with sickle cell disease are covered by Medicaid"],
    "Amyotrophic lateral sclerosis": ["Medicare", "ALS skips the SSDI waiting period and the 24-month Medicare wait"],
    "Cystic fibrosis": ["Commercial + Medicaid", "More than half of people with CF in the US are adults"],
  };
  function payerFocus(P, kidney) {
    if (PAYER_SPECIAL[P.name]) return PAYER_SPECIAL[P.name];
    const age = ageGroup(P);
    if (age === "older") return ["Medicare", "Mostly older adults, so Medicare (Part B and Part D) is central"];
    if (age === "peds") return ["Medicaid/CHIP + commercial", "Childhood onset: about 3 in 5 US children use Medicaid/CHIP at some point"];
    if (kidney) return ["Commercial, then Medicare", "Kidney failure (ESRD) qualifies for Medicare at any age"];
    return ["Commercial plans", "Mostly working-age adults on employer or marketplace plans"];
  }

  const US_FACTS = {
    partD: "Medicare Part D out-of-pocket cap: $2,100 in 2026 (rising to about $2,400 in 2027).",
    copay: "Manufacturer copay cards can't be used by Medicare or Medicaid patients (federal anti-kickback rules).",
    orphan: "Orphan Drug Act: under 200,000 US patients; 7 years of market exclusivity.",
    esrd: "Kidney failure (ESRD) qualifies people of any age for Medicare.",
    medicaidKids: "About 3 in 5 US children are covered by Medicaid or CHIP at some point before 18 (JAMA, 2025).",
    cgt: "CMS Cell & Gene Therapy Access Model: 33 states + DC + PR (sickle cell gene therapies).",
    nbs: NBS_CONTEXT,
  };

  /* ---------- US access rows for a profile ---------- */
  const GENE = /gene therapy|autotemcel|parvovec|crispr|edit|\bvec\b|graft|zamikeracel|exuparvovec|isteparvovec/i;
  const INFUSED = /\bert\b|enzyme|infusion|\biv\b|ivig|scig|immunoglobulin|intrathecal|alfa|glucosidase|gene therapy|autotemcel|parvovec|implant|transplant|hsct|cerliponase|emicizumab|factor/i;
  function access(P) {
    const rx = P.pipeline || [];
    const approved = rx.filter(r => r[2] === "A"), filed = rx.filter(r => r[2] === "F");
    const offLabel = rx.filter(r => r[2] === "O"), exUS = rx.filter(r => r[2] === "X");
    const age = ageGroup(P);
    const kidney = P.cat === "kidney" || (P.stages || []).some(s => /dialysis|kidney failure|transplant.*kidney|kidney transplant/i.test(s.d.join(" ") + " " + s.p));
    const gene = approved.some(r => GENE.test(r[0] + " " + r[3]));
    const infused = approved.some(r => INFUSED.test(r[0] + " " + r[3]));
    const rows = [];
    let fda = approved.length ? `${approved.length} FDA-approved option${approved.length > 1 ? "s" : ""}` : "No FDA-approved therapy";
    if (filed.length) fda += ` · ${filed.length} under FDA review`;
    if (exUS.length) fda += ` · ${exUS.length} approved only outside the US`;
    if (offLabel.length && !approved.length) fda += " · off-label options in use";
    rows.push(["landmark", "FDA", "Approval, label, REMS", "All US patients", fda]);
    rows.push(["coins", "Medicare", infused ? "Part B (clinic-given) · Part D (pharmacy)" : "Part D (pharmacy) · Part B (clinic-given)",
      age === "older" ? "Many patients (mostly older adults)" : kidney ? "Any age once kidneys fail (ESRD)" : P.name === "Amyotrophic lateral sclerosis" ? "People with ALS on SSDI, with no 24-month wait" : "65+, SSDI disability or ESRD",
      approved.length ? "2026 Part D cap $2,100; no manufacturer copay cards" : "Covers tests, visits and supportive care"]);
    rows.push(["shield", "Medicaid & CHIP", "State coverage, prior authorization", age === "peds" ? "Many children with the disease" : "Low-income and disabled adults",
      P.name === "Sickle cell disease" ? "CMS gene therapy access model: 33 states + DC + PR" : age === "peds" ? "~3 in 5 US kids are on Medicaid/CHIP at some point" : "Covers FDA-approved drugs, often with prior auth"]);
    rows.push(["building", "Commercial plans & PBMs", "Prior auth · step therapy · specialty tier", "Employer & marketplace plans",
      approved.length ? "Copay assistance and accumulator rules shape patient cost" : "Coverage for genetic testing and specialist care varies"]);
    if (approved.length) rows.push(["pill", "Specialty pharmacy & hub", "Limited distribution, benefits verification", "Patients on branded therapy", gene ? "Gene therapy: single-case or outcomes-based agreements" : "Hubs handle prior auth, copay help and shipping"]);
    const nb = nbs(P.name);
    if (nb.level !== "none") rows.push(["target", "Newborn screening (RUSP)", "Federal panel + state choices", "Newborns", nb.text]);
    rows.push(["scale", "ICER", "Value assessment", "Payer negotiations", approved.length ? "May review high-cost therapies (icer.org)" : "Reviews new therapies when they reach FDA"]);
    const net = networks(P.name, P.cat, gene)[0];
    rows.push(["hospital", net[0], "Specialist centers", "Referred patients", net[1]]);
    return { rows, age, kidney, gene, facts: [
      US_FACTS.orphan,
      approved.length ? US_FACTS.partD : null,
      approved.length ? US_FACTS.copay : null,
      kidney ? US_FACTS.esrd : null,
      age === "peds" ? US_FACTS.medicaidKids : null,
      P.name === "Sickle cell disease" ? US_FACTS.cgt : null,
      P.name === "Amyotrophic lateral sclerosis" ? "ALS: no 5-month SSDI waiting period (law of December 2020), and Medicare starts with SSDI instead of after the usual 24-month wait (law passed in 2000)." : null,
      nb.level !== "none" ? US_FACTS.nbs : null,
    ].filter(Boolean) };
  }

  return { VERIFY, credentialsFor, nbs, networks, estimate, orphanStatus, access, ageGroup, payerFocus, US_FACTS, NET };
})();
