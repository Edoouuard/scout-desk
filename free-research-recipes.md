# Free founder-signal workflow

This workflow is deliberately **free-first**, reproducible and human-reviewed. It does not scrape LinkedIn, bypass authentication, or claim that unavailable public data proves that a founder has no funding.

## 1. Daily signal loop (20-30 minutes)

### X / public web queries

Run these Google/Bing queries with a recency filter of one week, then capture only posts that identify a real person plus a European location or employer:

```text
site:x.com "now building in Stealth Mode" "London"
site:x.com "now building in Stealth Mode" "Berlin"
site:x.com "now building in Stealth Mode" "Paris"
site:x.com "now building in Stealth Mode" "Stockholm"
site:x.com "now building in Stealth Mode" "Amsterdam"
site:x.com "working on something new" founder "2026" Europe
site:x.com "building in stealth" founder Europe
```

### LinkedIn search patterns

Use LinkedIn search manually, sorted by posts/date where available. Save profile URLs to the inbox; do not automate collection from LinkedIn.

```text
"Stealth Founder" AND (London OR Berlin OR Paris OR Stockholm OR Amsterdam)
"Co-Founder" AND "July 2026" AND (stealth OR building)
"Founder" AND "September 2026" AND "new chapter"
"working on something new" AND founder
```

### GitHub — no paid API required

Use GitHub search and the GitHub activity feeds for target employer alumni. Look for fresh organizations/repos, a waitlist, beta/release language, or a new personal domain.

```text
"private beta" language:TypeScript created:>2026-08-15
"early access" language:Python created:>2026-08-15
"waitlist" "AI agent" created:>2026-08-15
"self-hosted" "open source" created:>2026-08-15
```

Target alumni sets: Amazon/AWS, Google/DeepMind, Stripe, Datadog, Cloudflare, NordVPN, Revolut, Klarna, Spotify, Mistral AI, Hugging Face, SAP, Personio, Qonto, Doctolib, Bolt.

### Product Hunt / Substack / personal blogs

- Product Hunt: inspect new launches under AI, Developer Tools, Security, Productivity, Fintech and SaaS. Prefer projects with a beta/waitlist and no announced round.
- Google: `"building in public" founder Europe 2026`, `"why I left" "to build" founder Europe`, `site:substack.com "building" founder Europe 2026`.

## 2. Minimum signal record

Every entry requires:

- Name and public profile/source URL.
- Signal date and exact public excerpt.
- Country or city evidence.
- Prior employer/role when public.
- A clear label: `needs_review`, `watch`, or `rejected`.
- A factual verification label, never an unsupported negative claim.

Correct:

```text
No public institutional round found in initial open-web review; verify before outreach.
```

Incorrect:

```text
No funding.
```

## 3. Manual verification before outreach

1. Search `[name] [project/company] funding`, `raised`, `seed`, `pre-seed`, `backed by`.
2. Search `[name] [project/company] YC`, `Y Combinator`, `Entrepreneur First`, `Antler`, `Station F`.
3. Check LinkedIn manually for company dates/cofounders.
4. Check the relevant business register where a company name/jurisdiction is available.
5. Add a new source URL to the record and only then move the founder to `qualified`.

## 4. Scoring rubric

| Signal | Score |
|---|---:|
| Founder/stealth transition in last 30 days | +30 |
| Explicit public "stealth" or "building" statement | +20 |
| European location confirmed | +10 |
| Ex-target employer / strong operator background | +15 |
| Founding engineer, staff engineer or repeat technical founder | +15 |
| Relevant B2B AI, cyber, fintech infra or devtools thesis | +15 |
| No public institutional round found after initial check | +10 |
| Accelerator affiliation not found after initial check | +5 |
| Institutional round publicly announced | -100 |
| YC/EF/Antler/Station F affiliation publicly confirmed | -100 |

## 5. Ingestion format

Append one JSON object to `data/founder-signals.json`. Do not overwrite an existing person; add a new signal or source URL to their history instead.

The inbox is static by design, so it is auditable in Git and runs with no API keys or paid database. When a database is added later, migrate the same object shape into `founders`, `signals` and `verification_checks` tables.
