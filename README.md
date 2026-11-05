# Rare·Desk

Market research for rare life sciences: a US desk-research tool for rare diseases.

**Home page:** a small R·D brand mark top left and the search bar top centre. Below it, one headline at a time from **What's new in rare disease** (recent US approvals, FDA and CMS policy, newborn screening, deals, each linked to its source); swipe, use the arrow keys or tap the dots for more. It shows the 8 newest headlines; the last slides list **FDA decisions to watch** (company-announced target dates, soonest first), and a decision drops off by itself once its date has passed. The news lives in `data/news.js`; update it there (it was last updated November 5, 2026). A small dock at the bottom centre has **Home**, **Disease directory** and **I'm feeling lucky** (opens the best match for what you typed, or a random disease when the box is empty).

**Look and feel:** borrowed from a clinical dashboard reference: a warm light-grey canvas, white cards with roomy spacing, a charcoal band and dock, thin connector lines and lime highlights. Text is large and plain; medical and US-system jargon (Orphan Drug Act, RUSP, Part D, PBM, ICD-10-CM…) is dotted-underlined: hover or tap it for a one-line explanation, and a **Jargon buster** card at the end of a tab lists every term used there.

**Disease page:** a charcoal band on top with the disease name in a notch and a close button on the left, and icon pills for the tabs on the right (the open tab is white). The band stays put while you scroll. The tabs show short labels (About, Journey, Patients, Stakeholders, Gaps, Innovation, Screener), and icons only for the closed tabs when the window is narrow. Under the band: the key numbers (category, US patients, typical onset, FDA-approved therapies, programs in development, gaps), then the open tab. Each tab opens with a friendly title ("Meet Bronchiectasis", "Who's in the room", "What's still missing"…) and the page scrolls; cards fade in as they come into view (not with reduced motion). The dock has **Home**, **Search** (or press `/`) and **Ask the assistant**. Arrow keys move between tabs, and each tab has its own link, for example `#bronchiectasis/screener`.

1. **About**: the disease in brief (what it is, who gets it, how it's diagnosed and treated, who treats it, other names and ICD-10-CM), a lime **Did you know?** card with quick facts (1 in how many Americans, the slowest stage, what patients say about the hardest stage; tap **Next fact**), top articles (NIH, NORD, GeneReviews, PubMed) and videos.
2. **Causes & journey**: the usual causes, then the patient journey as a sideways timeline (swipe, scroll or use the arrows). Each stage shows how long it takes, how the patient feels (the line is coloured by mood), a patient quote, what happens, the pain point and who leads or supports; tap a person to open them on the stakeholder map. The story plays stage by stage (about every 3 seconds): pause, play or replay; click a stage, or use the arrow keys on a stage. The **+** at the end asks the assistant where the biggest delays are. With reduced motion turned on, nothing plays until you press play.
3. **US patients**: the US estimate counting up (and about 1 in how many Americans), the number pictured as NFL stadiums, basketball arenas, jumbo jets or school buses, a log-scale gauge against the 200,000 Orphan Drug Act threshold, typical onset, newborn screening (RUSP), who pays most, ICD-10-CM codes, where patients are treated and the US rules that shape care.
4. **Stakeholder map**: everyone involved, against each numbered journey stage (who leads, who supports), with a key to the stages. Pick a person for their role, stages, and the US license or board certification they need, with links to verify an individual, and a button to build a screener for them. **Access & payers** lists FDA, Medicare (Part B/D), Medicaid & CHIP, commercial plans and PBMs, specialty pharmacy, ICER and care networks: what each controls and why it matters.
5. **Gaps & needs**: the gaps commonly discussed as numbered cards, by severity (major, notable, emerging), with who can close them.
6. **Innovation**: the pipeline by US status on a connected track (Phase 1–2, Phase 3, FDA review, FDA approved; approved outside the US only; off-label), FDA decisions due and news for this disease, companies and organizations, and work beyond drugs (devices, diagnostics, registries).
7. **Screener builder**: a step-by-step builder for a recruitment screener (see below).

Everything follows the US health system: FDA approval status, ICD-10-CM codes, US population estimates against the Orphan Drug Act threshold (under 200,000), US payers, US specialist titles and US patient organizations. Data reviewed October 2026, with November 2026 approvals and filings added from the news; approval status changes quickly, so verify before citing.

## Disease coverage

- **173 profiles**: bronchiectasis (in-depth, defined in `js/app.js`) plus 172 directory diseases in `data/diseases.js`. They are grouped into 15 categories: immune deficiency, autoinflammatory & rheumatic, rare tumors (including desmoid tumor), inherited metabolic, neuromuscular, neurological & epilepsy, blood & bleeding, lung, kidney, endocrine/bone/growth, skin & connective tissue, heart, liver & gut, eye (including Demodex blepharitis) and developmental syndromes.
- Every disease has its own journey map, stakeholder map and gap list in `data/journeys/`.
- **Anything else**: live US research links (GARD, NORD, PubMed, ClinicalTrials.gov US sites, FDA orphan designations, ICER).

Search matches names, abbreviations and alternate names, suggests as you type and tolerates typos ("brochiactasis"). **Directory** lists everything by category.

## Screener builder

Seven steps, each pre-filled from the disease profile:

1. **Stakeholder**: who to recruit: physicians, care team, lab, pharmacy, patients, caregivers, payers or advocacy leaders. From the stakeholder map, "Build a screener" opens this step already chosen.
2. **Certifications**: which credentials are required, from the US certification data (for example a state medical license and "ABIM: Internal Medicine + Pulmonary Disease", with or without board-eligible). Patients and caregivers get diagnosis checks instead (diagnosed by a doctor, confirmed by a specialist, proof on request, genetic test). Each ticked item becomes a question where "No" terminates.
3. **What matters**: work experience, patient volume and hospital or practice setting, plus extras that fit the stakeholder (time in direct patient care, treatment decision role, US region; covered lives for payers; age, time since diagnosis and insurance for patients).
4. **Ranges & quotas**: the minimum and maximum for each (years, patients over a chosen period, percent of time), and for lists such as settings, regions or insurance, which answers are accepted and the minimum and maximum share of the sample. The patient-volume minimum starts from the US estimate (rarer disease, lower threshold). Impossible quotas are flagged before you move on.
5. **Study brief**: study name, what you want to learn, method (interviews, online survey, focus groups), sample size, length, topics, products to ask about, fieldwork dates and incentive. The topics write the study questions in part C (diagnosis journey, treatment, awareness of therapies, the pipeline, unmet needs, access and prior authorization, support, genetic testing, quality of life and more).
6. **Question types**: single choice, multiple choice, matrix, form field, rating scale and ranking. Each question uses the first allowed type that suits it.
7. **Review & export**: click any wording to edit it, switch a question's type, change any answer's logic (Terminate, Continue, Quota, Record, Flag), untick what you don't need, and adjust the quota plan. A list of every termination updates as you go.

**Download Word** (.docx, US Letter) gives the study brief, who qualifies, every question with its type, options and logic, the quota plan with interview counts, and all terminations. You can also copy the text, download CSV (for survey platforms) or send the draft to the assistant to tailor. A US compliance block (industry and household exclusion, past-3-month participation, VT/MN/MA flags, federal employees, blinded sponsor for CMS Open Payments) and an adverse-event notice are on by default.

## Assistant

- **Published on claude.ai**: answers through the viewer's own Claude access (the artifact `sample` capability). It is grounded on the open profile and cites the page's sources, and it can look up and compare other diseases in the directory. It can't browse the web there.
- **Self-hosted copy** (opened outside Claude): paste an Anthropic API key to turn on web research. The assistant then uses the official SDK (`@anthropic-ai/sdk`, loaded from jsDelivr) with web search and web fetch, and lists the sources it cites. The key stays in that browser tab (sessionStorage) and is sent only to the Claude API. Use this only on a device you trust.

Fast answers by default; switch to **Thorough** for harder questions. Not medical advice.

## Run

Open `index.html` in a browser. There is no build step. Deep link to a profile with `index.html#bronchiectasis`, to one of its tabs with `index.html#fabry-disease/journey`, or to the full list with `index.html#directory`.

## Files

- `index.html`: layout, styles and animations (warm light-grey canvas #ECECE6, white cards, charcoal band and dock #3B3C37, lime #E0F05A highlights, Helvetica)
- `js/app.js`: search, the disease page and its tabs (journey story, stakeholder map, US numbers, fun facts, jargon pop-ups), directory, the bronchiectasis profile
- `js/us.js`: US reference data (credentials, care networks, newborn screening, payer rules, population estimates, age of onset)
- `js/screener.js`: the step-by-step screener builder and its Word/CSV/text export
- `js/assistant.js`: chat assistant
- `data/diseases.js`, `data/journeys/*.js`: disease data
- `data/news.js`: home page news and FDA decisions to watch

## Add a disease

Add an object to `data/diseases.js` (field key at the top of that file). Then add its journey, stakeholders and gaps to a file in `data/journeys/` (format at the top of `immuno.js`), and its age-of-onset group to `AGE` in `js/us.js`. Without a journey entry the page falls back to a generic template.
