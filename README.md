# Rare·Desk

A US desk-research tool for rare diseases. Search a disease from a Google-style search bar to get a one-screen dashboard. Every card opens a detail drawer.

- **About the disease**: summary, cause, diagnosis, treatment, top articles (NIH, NORD, GeneReviews, PubMed) and videos
- **Patient journey**: stages, what happens, how the patient feels and the pain point at each stage, laid out alongside the stakeholder map (who leads or supports at each stage)
- **Stakeholders**: shown with their US titles (for example Pulmonologist, Respiratory therapist)
- **US access & payers**: FDA, Medicare (Part B/D), Medicaid & CHIP, commercial plans and PBMs, specialty pharmacy, newborn screening (RUSP), ICER and care networks, plus who influences access, how and why
- **Therapies & pipeline**: US status ladder (Phase 1–2, Phase 3, FDA review, FDA approved; approved outside the US only; off-label in the US)
- **Gaps** commonly discussed, with owners, and the **companies and organizations** working on them
- **Certifications**: what US license or board certification each stakeholder needs (state licensure, ABMS boards, NBRC, ABGC, CLIA, FACT and more), with links to verify an individual
- **Screener builder**: drafts a recruitment screener for any stakeholder from the disease data (see below)
- **Assistant**: a chat panel on every disease page (see below)

Everything follows the US health system: FDA approval status, ICD-10-CM codes, US population estimates against the Orphan Drug Act threshold (under 200,000), US payers, US specialist titles and US patient organizations. Data reviewed October 2026; approval status changes quickly, so verify before citing.

## Disease coverage

- **173 profiles**: bronchiectasis (in-depth, defined in `js/app.js`) plus 172 directory diseases in `data/diseases.js`. They are grouped into 15 categories: immune deficiency, autoinflammatory & rheumatic, rare tumors (including desmoid tumor), inherited metabolic, neuromuscular, neurological & epilepsy, blood & bleeding, lung, kidney, endocrine/bone/growth, skin & connective tissue, heart, liver & gut, eye (including Demodex blepharitis) and developmental syndromes.
- Every disease has its own journey map, stakeholder map and gap list in `data/journeys/`.
- **Anything else**: live US research links (GARD, NORD, PubMed, ClinicalTrials.gov US sites, FDA orphan designations, ICER).

Search matches names, abbreviations and alternate names, suggests as you type and tolerates typos ("brochiactasis"). **Directory** lists everything by category.

## Screener builder

Pick a stakeholder (physicians, care team, lab, pharmacy, patients, caregivers, payers, advocacy leaders) and a method (60-minute interview, online survey, focus group). The draft is pre-filled from the profile:

- **Termination logic** on each answer: Terminate, Continue, Quota, Record, Flag
- **US compliance block**: industry and household exclusion, past-3-month participation, VT/MN/MA state-law flags, federal employee flag, blinded sponsor (CMS Open Payments) and an adverse-event notice
- **Credentials** from the certification data (for example "ABIM: Internal Medicine + Pulmonary Disease")
- **Patient volume threshold** scaled to the US estimate (rarer disease, lower threshold)
- **Journey-stage involvement** from the stakeholder map, **therapies** from the pipeline, **payer mix** from the US access data
- A **quota plan**

Click any wording to edit it and untick questions to drop them. Then copy the text, download Word (.docx, US Letter) or CSV (for survey platforms), or send the draft to the assistant to tailor.

## Assistant

- **Published on claude.ai**: answers through the viewer's own Claude access (the artifact `sample` capability). It is grounded on the open profile and cites the page's sources, and it can look up and compare other diseases in the directory. It can't browse the web there.
- **Self-hosted copy** (opened outside Claude): paste an Anthropic API key to turn on web research. The assistant then uses the official SDK (`@anthropic-ai/sdk`, loaded from jsDelivr) with web search and web fetch, and lists the sources it cites. The key stays in that browser tab (sessionStorage) and is sent only to the Claude API. Use this only on a device you trust.

Fast answers by default; switch to **Thorough** for harder questions. Not medical advice.

## Run

Open `index.html` in a browser. There is no build step. Deep link to a profile with `index.html#bronchiectasis` or `index.html#fabry-disease`, or to the full list with `index.html#directory`.

## Files

- `index.html`: layout and styles (navy theme, Helvetica)
- `js/app.js`: search, dashboard, detail drawer, directory, the bronchiectasis profile
- `js/us.js`: US reference data (credentials, care networks, newborn screening, payer rules, population estimates, age of onset)
- `js/screener.js`: screener builder and Word/CSV export
- `js/assistant.js`: chat assistant
- `data/diseases.js`, `data/journeys/*.js`: disease data

## Add a disease

Add an object to `data/diseases.js` (field key at the top of that file). Then add its journey, stakeholders and gaps to a file in `data/journeys/` (format at the top of `immuno.js`), and its age-of-onset group to `AGE` in `js/us.js`. Without a journey entry the page falls back to a generic template.
