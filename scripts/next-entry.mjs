// Prints the next calendar entry that is due and not yet published.
// Usage: node scripts/next-entry.mjs [--within <days>] [--markdown]
//   --within N   only entries dated within N days from today (default: next unpublished entry)
//   --markdown   print a brief with the verification checklist (used by the weekly reminder)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/calendar.json'), 'utf8'));
const args = process.argv.slice(2);
const within = args.includes('--within') ? Number(args[args.indexOf('--within') + 1]) : null;
const markdown = args.includes('--markdown');

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// An entry counts as published if a content file starts with its slug.
function published(e) {
  const dir = path.join(ROOT, 'src/content', e.type === 'tool' ? 'tools' : 'case-studies');
  const base = slugify(e.title.split(' or ')[0].replace(/\(.*\)/, ''));
  return fs.readdirSync(dir).some((f) => f.replace(/\.md$/, '').startsWith(base));
}

const today = new Date(new Date().toISOString().slice(0, 10));
const due = cal.entries
  .filter((e) => !published(e))
  .filter((e) => within === null || (new Date(e.date) - today) / 86400000 <= within)
  .sort((a, b) => a.date.localeCompare(b.date));

if (!due.length) {
  console.log(markdown ? '' : 'Nothing due.');
  process.exit(0);
}

const e = due[0];
if (!markdown) {
  console.log(JSON.stringify(e, null, 2));
  process.exit(0);
}

const kind = e.type === 'tool' ? 'tool' : 'case study';
console.log(`## Due: ${e.title} (${kind}, publish ${e.date})

**Angle:** ${e.angle}
${e.type === 'tool' ? `**Category:** ${e.category}` : `**Region:** ${e.continent} · **Themes:** ${e.themes}`}

### To do
1. In Claude Code, in this repo, run \`/draft-next-entry\`
2. Review the pull request it opens: every figure against its source, tone, photo credit
3. Merge by ${e.date} (the site deploys on merge)
4. Copy the post drafts from the "Social drafts" issue that appears after merge

### Verification checklist
- [ ] Exists, with an official source URL
- [ ] Every number has a named source, listed under Sources
- [ ] Licence matches the \`license\` enum (tools)
- [ ] All links load (CI checks internal links; the monthly job checks external)
- [ ] Photo is CC BY, CC BY-SA, CC0 or public domain, with credit in frontmatter and docs/IMAGE-CREDITS.md
- [ ] No guessed data (\`citedBy\`-style fields, user counts, dates)
- [ ] \`npm run build\` is clean
`);
