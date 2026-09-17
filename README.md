# Scout Desk

Scout Desk is a lightweight, static founder-sourcing CRM.

## Early Founders

The public signal inbox is now available as a first-class page: [`early-founders.html`](./early-founders.html). It links back to the main radar (`index.html`) and is designed to stay separate from qualified dealflow.

- Dataset: [`data/founder-signals.json`](./data/founder-signals.json)
- Research process: [`free-research-recipes.md`](./free-research-recipes.md)
- Legacy URL: [`signal-inbox.html`](./signal-inbox.html) redirects to Early Founders.
- No API keys, paid database, scraper, or runtime dependency required.
- Each record keeps its source URL, excerpt, score and verification warnings.
- `No public funding found` means exactly that: it is a prompt to verify, never proof of no funding.

## Free workflow

1. Run the public-web and GitHub searches in `free-research-recipes.md`.
2. Add only evidence-backed candidates to `data/founder-signals.json` with `needs_review`.
3. Verify funding, accelerator affiliation, location and company age manually.
4. Promote only verified candidates into the main CRM pipeline.

## Local preview

Because the project is static, any static HTTP server works:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/early-founders.html`.
