// Builds the content-schedule reminder: a single tracking-issue body plus
// nudge text fired at exactly 7, 3 and 1 days before an unpublished entry is
// due (and a one-time "overdue" ping the day after). Pure calendar logic — the
// workflow (content-reminders.yml) upserts the issue and posts the nudge.
//
// Writes two files in the working dir:
//   reminder-body.md   — the always-current issue body (upsert every run)
//   reminder-nudge.md   — comment to post THIS run, or empty if no nudge today
//
// Test a specific day with:  REMIND_TODAY=2026-10-27 node scripts/due-reminders.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/calendar.json'), 'utf8'));

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function published(e) {
  const dir = path.join(ROOT, 'src/content', e.type === 'tool' ? 'tools' : 'case-studies');
  const base = slugify(e.title.split(' or ')[0].replace(/\(.*\)/, ''));
  try {
    return fs.readdirSync(dir).some((f) => f.replace(/\.md$/, '').startsWith(base));
  } catch {
    return false;
  }
}

const todayStr = process.env.REMIND_TODAY || new Date().toISOString().slice(0, 10);
const today = new Date(todayStr);
const daysUntil = (d) => Math.round((new Date(d) - today) / 86400000);

// Nudge thresholds: the 7-day reminder, 3- and 1-day nudges, and one overdue ping.
const NUDGE_DAYS = new Set([7, 3, 1, -1]);

const upcoming = cal.entries
  .filter((e) => !published(e))
  .map((e) => ({ ...e, n: daysUntil(e.date) }))
  .sort((a, b) => a.date.localeCompare(b.date));

function badge(n) {
  if (n < 0) return `🔴 ${-n} day(s) overdue`;
  if (n === 0) return '🚨 due today';
  if (n === 1) return '🚨 due tomorrow';
  if (n <= 3) return `⚠️ in ${n} days`;
  if (n <= 7) return `⏳ in ${n} days`;
  return `🗓️ in ${n} days`;
}

const kindLabel = (e) => (e.type === 'tool' ? `tool · ${e.category}` : `case study · ${e.continent} · ${e.themes}`);

// ---- issue body (always current) ----
const shown = upcoming.filter((e) => e.n <= 21).slice(0, 8);
const rows = shown.length
  ? shown.map((e) => `| ${e.date} | ${badge(e.n)} | **${e.title}** | ${kindLabel(e)} | ${e.angle || ''} |`).join('\n')
  : '| — | — | Nothing unpublished in the next 3 weeks | — | — |';

const body = `_Auto-updated daily by \`content-reminders.yml\`. This is the single place to track what's due._

## Upcoming content

| Publish | Status | Title | Kind | Angle |
|---|---|---|---|---|
${rows}

### How to action an item
1. In Claude Code, in this repo, run \`/draft-next-entry\` — it researches, writes the entry, finds a Commons photo, builds, and opens a **pull request**.
2. Review the PR (every figure against its source, tone, photo credit).
3. **Merge the PR to approve & publish** (Cloudflare deploys \`main\`).

Nudges are posted as comments below at 7, 3 and 1 days before each due date. Change a date in \`content/calendar.json\` to reschedule.

<!-- updated ${todayStr} -->
`;
fs.writeFileSync(path.join(ROOT, 'reminder-body.md'), body);

// ---- nudge comment (only on exact threshold days) ----
const due = upcoming.filter((e) => NUDGE_DAYS.has(e.n));
let nudge = '';
if (due.length) {
  const lines = due.map((e) => {
    const when = e.n === -1 ? `was due ${e.date} (now overdue)` : `is due ${e.date} (${badge(e.n)})`;
    return `- **${e.title}** (${kindLabel(e)}) ${when} — run \`/draft-next-entry\` and review/merge its PR, or reschedule in \`content/calendar.json\`.`;
  });
  nudge = `### ⏰ Content nudge — ${todayStr}\n\n${lines.join('\n')}\n`;
}
fs.writeFileSync(path.join(ROOT, 'reminder-nudge.md'), nudge);

console.log(`body: ${shown.length} upcoming shown; nudge: ${due.length ? due.map((e) => `${e.title}(${e.n}d)`).join(', ') : 'none'}`);
