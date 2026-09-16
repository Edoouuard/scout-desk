# Scout desk — private founder sourcing & deal-flow CRM

Single-file app (`index.html`), no build step, no backend. Works on GitHub Pages.

## Deploy on GitHub Pages (2 minutes)
1. Create a new **private** repository (e.g. `scout-desk`).
2. Upload `index.html` and this `README.md` to the root.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. Your desk is live at `https://<your-user>.github.io/scout-desk/` after ~1 minute.
   (Private-repo Pages requires GitHub Pro/Team; on a free account make the repo public or use Vercel / Netlify drag-and-drop instead.)

## Where the data lives
- The **seed dealflow** is embedded in `index.html` (search for `const SEED`). Edit that array on GitHub and every browser that opens the page merges the new entries automatically.
- Your edits (pipeline stage, notes, drafts) are saved in the browser's localStorage.
- **Settings → Export everything (JSON)** gives you a backup; paste it back with **Import JSON**, or paste the `deals` array into the seed to make it permanent.

## Adding dealflow
- **Add deal** form, or **Import JSON** (Sources & import). Ask Claude to convert raw notes / newsletters / fund emails to this shape:

```json
[{"company":"","website":"","oneLiner":"","signalType":"Raising","signalDate":"2026-09-15",
  "origin":"sourced|fund-intro|inbound","referredBy":"","sector":"","geo":"","stage":"Seed","amount":"",
  "investors":"","founders":[{"name":"","role":"","linkedin":"","email":""}],"tags":[]}]
```

## Radar (autonomous sourcing)
`radar/radar.js` runs in GitHub Actions every 6 hours (`.github/workflows/radar.yml`): it reads the public feeds listed in `radar.config.json` (FinSMEs, TechCrunch Startups, EU-Startups, Tech.eu, Maddyness, Sifted, Product Hunt, YC Launches, Show HN), detects funding rounds and launches, tags sectors, scores each item against your thesis and commits `radar.json`. Vercel redeploys and the **Radar** tab shows the candidates with "Add to inbox" / "Dismiss".

Setup once: push all files, then GitHub → Actions → Radar → *Run workflow*. Tune keywords, sectors and sources in `radar.config.json`.

## Features
Daily digest (ranked by thesis relevance × freshness) · searchable inbox with detail pane, notes, relevance slider · drag-and-drop deal board · founders directory with profile links · outreach drafts generated from the deal's own facts (email / LinkedIn / X) · Slack alert text per deal or per digest · CSV / JSON export · light & dark.
