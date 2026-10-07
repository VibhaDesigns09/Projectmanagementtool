# Rare·Desk

A desk-research tool for rare diseases. Type a disease into the search bar and the results split into four quadrants:

1. **About the disease**: summary, key facts, top articles and videos
2. **Stakeholders involved**: the patient journey and who takes part at each stage
3. **Access & reimbursement**: who influences access to treatment, how, who it affects, and why
4. **Innovations**: pipeline drugs, diagnostics and research infrastructure

Below the quadrants are the **gaps** commonly discussed for the disease and the **companies and networks** working on them.

## Disease coverage

- **In-depth profile:** bronchiectasis, with a disease-specific journey, stakeholder map, influencers and gaps.
- **Directory profiles:** 170 rare diseases in `data/diseases.js`, grouped into 14 categories: immune deficiency, autoinflammatory & rheumatic, inherited metabolic, neuromuscular, neurological & epilepsy, blood & bleeding, lung, kidney, endocrine/bone/growth, skin & connective tissue, heart, liver & gut, eye and developmental syndromes. Each has quick facts, ICD-10 code, specialists, approved therapies and pipeline with companies, and patient organisations. The journey map and stakeholder map use a typical template for the disease type (early-onset genetic, immune deficiency or chronic).
- **Anything else:** live research links for each quadrant (PubMed, Orphanet, GARD, NORD, ClinicalTrials.gov, NICE).

Search matches names, abbreviations and alternate names, suggests as you type, and tolerates typos ("brochiactasis"). The home page only shows a few examples; **Browse all diseases** lists everything by category.

Approval status is US FDA unless noted, reviewed October 2026.

## Run

Open `index.html` in a browser. There is no build step. Deep link to a profile with `index.html#bronchiectasis` or `index.html#fabry-disease`, or to the full list with `index.html#directory`.

## Add a disease

- **Directory profile:** add an object to `data/diseases.js`. The field key is documented at the top of that file.
- **In-depth profile:** add an entry to the `DISEASES` object in `index.html`, following the bronchiectasis entry. In-depth profiles take priority over directory entries with the same name.
