# Scout CRM + détection signaux faible, version publique

Shoot me a DM on LinkedIn if you want to share some dealflow. 



## Radar (autonomous sourcing)
`radar/radar.js` runs in GitHub Actions every 6 hours (`.github/workflows/radar.yml`): it reads the public feeds listed in `radar.config.json` (FinSMEs, TechCrunch Startups, EU-Startups, Tech.eu, Maddyness, Sifted, Product Hunt, YC Launches, Show HN), detects funding rounds and launches, tags sectors, scores each item against your thesis and commits `radar.json`. Vercel redeploys and the **Radar** tab shows the candidates with "Add to inbox" / "Dismiss".

Setup once: push all files, then GitHub → Actions → Radar → *Run workflow*. Tune keywords, sectors and sources in `radar.config.json`.

## Features
Daily digest (ranked by thesis relevance × freshness) · searchable inbox with detail pane, notes, relevance slider · drag-and-drop deal board · founders directory with profile links · outreach drafts generated from the deal's own facts (email / LinkedIn / X) · Slack alert text per deal or per digest · CSV / JSON export · light & dark.
