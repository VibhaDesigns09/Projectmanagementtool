# Rare·Desk

A desk-research tool for rare diseases. Type a disease into the search bar and the results split into four quadrants:

1. **About the disease**: summary, key facts, top articles and videos
2. **Stakeholders involved**: the patient journey and who takes part at each stage
3. **Access & reimbursement**: who influences access to treatment, how, who it affects, and why
4. **Innovations**: pipeline drugs, diagnostics and research infrastructure

Below the quadrants are the **gaps** commonly discussed for the disease and the **companies and networks** working on them.

The first curated profile is **bronchiectasis** (typos such as "brochiactasis" still match). Any other disease gets live research links for each quadrant (PubMed, Orphanet, GARD, NORD, ClinicalTrials.gov, NICE).

## Run

Open `index.html` in a browser. There is no build step. Deep link to a profile with `index.html#bronchiectasis`.

## Add a disease

Add an entry to the `DISEASES` object in the `<script>` block of `index.html`, following the bronchiectasis entry.
