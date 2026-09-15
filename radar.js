// Scout desk radar — runs in GitHub Actions (Node 20+, no dependencies).
// Reads public feeds, extracts startup signals, scores them, writes radar.json.
const fs = require("fs");
const path = require("path");
const root = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(root, "radar.config.json"), "utf8"));
const outPath = path.join(root, "radar.json");
let previous = [];
try { previous = JSON.parse(fs.readFileSync(outPath, "utf8")).items || []; } catch (e) {}

const UA = "scout-desk-radar/1.0 (+https://github.com)";
const strip = s => String(s || "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const tag = (block, name) => { const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i")); return m ? strip(m[1]) : ""; };
const attr = (block, name, a) => { const m = block.match(new RegExp(`<${name}\\s[^>]*${a}="([^"]+)"`, "i")); return m ? m[1] : ""; };

async function get(url) {
  const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, application/json;q=0.9, */*;q=0.8" }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}
function parseRSS(xml, source) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const title = tag(b, "title"); let link = tag(b, "link") || attr(b, "link", "href"); if (!link) link = tag(b, "guid");
    const date = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date");
    const summary = tag(b, "description") || tag(b, "summary") || tag(b, "content:encoded") || tag(b, "content");
    if (title && link) items.push({ title, link: link.trim(), date: new Date(date || Date.now()).toISOString(), summary: summary.slice(0, 600), source });
  }
  return items;
}
function parseHN(json, source) {
  const j = JSON.parse(json);
  return (j.hits || []).map(h => ({ title: h.title, link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, date: h.created_at, summary: (h.story_text || "").slice(0, 600), source, discussion: `https://news.ycombinator.com/item?id=${h.objectID}` }));
}

const AMOUNT = /(?:[$€£]\s?\d+(?:[.,]\d+)?\s?(?:m|mn|million|k|bn|b)\b|\d+(?:[.,]\d+)?\s?(?:m€|m\$|million|millions|k€|k\$)\b)/i;
const STAGE = /\b(pre-?seed|seed|series [a-e]|angel|amorçage|stealth)\b/i;
const FUNDING = /\b(raises?|raised|secures?|closes?|lands?|announces?|lève|levée|levent|funding|round|financing|backed|investment)\b/i;
const LAUNCH = /\b(launch|launches|show hn|emerges? from stealth|out of stealth|unveils?)\b/i;

function classify(it) {
  const text = `${it.title} ${it.summary}`.toLowerCase();
  const sectors = Object.entries(cfg.sectors).filter(([, kws]) => kws.some(k => text.includes(k))).map(([s]) => s);
  const amount = (it.title.match(AMOUNT) || it.summary.match(AMOUNT) || [""])[0];
  const stageM = text.match(STAGE); const stage = stageM ? stageM[1].replace(/^\w/, c => c.toUpperCase()) : "";
  const isFunding = FUNDING.test(text) && (amount || stageM);
  const isLaunch = LAUNCH.test(text) || it.source === "Show HN" || it.source === "Product Hunt" || it.source === "YC Launches";
  let signalType = isFunding ? "Funding announcement" : isLaunch ? "Product launch" : "Other";
  if (/stealth/i.test(text)) signalType = "Stealth exit";
  // company name: text before " raises"/" lève"/":" or first words of Show HN title
  let company = "";
  let m = it.title.match(/^(?:show hn:\s*)?([^:–—]{2,60}?)\s+(?:raises|raised|secures|lands|closes|launches|emerges|announces|lève|unveils|gets|nabs|bags|picks up|is building)\b/i);
  if (m) company = m[1]; else { m = it.title.match(/^(?:show hn:\s*)?([^:–—]{2,50})/i); if (m) company = m[1]; }
  company = company.replace(/^(?:(?:[\w'’.]+(?:\s[\w'’.]+)?)-based\s+|the\s+|french\s+|german\s+|british\s+|uk\s+|dutch\s+|spanish\s+|italian\s+|swiss\s+|la\s+startup\s+|startup\s+)+/i, "").replace(/[,\s]+$/, "").trim();
  let score = 30;
  if (isFunding) score += 25; else if (isLaunch) score += 15;
  score += Math.min(20, sectors.length * 10);
  if (cfg.geoBoost.some(g => text.includes(g))) score += 10;
  if (cfg.stageBoost.some(s => text.includes(s))) score += 15;
  if (cfg.penalize.some(p => text.includes(p))) score -= 30;
  if (signalType === "Other") score -= 15;
  score = Math.max(0, Math.min(100, score));
  return { ...it, company, sectors, amount, stage, signalType, score };
}

(async () => {
  const all = [];
  for (const s of cfg.sources) {
    try { const body = await get(s.url); const items = s.type === "hn" ? parseHN(body, s.name) : parseRSS(body, s.name); console.log(`${s.name}: ${items.length}`); all.push(...items); }
    catch (e) { console.log(`${s.name}: failed (${e.message})`); }
  }
  const cutoff = Date.now() - cfg.keepDays * 864e5;
  const byLink = new Map();
  for (const p of previous) if (new Date(p.date).getTime() > cutoff) byLink.set(p.link, p);
  for (const it of all) { if (new Date(it.date).getTime() < cutoff) continue; if (!byLink.has(it.link)) byLink.set(it.link, { ...classify(it), firstSeen: new Date().toISOString() }); }
  const items = [...byLink.values()].filter(i => i.score >= 35).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, cfg.maxItems);
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), sources: cfg.sources.map(s => s.name), items }, null, 1));
  console.log(`radar.json: ${items.length} items`);
})();
