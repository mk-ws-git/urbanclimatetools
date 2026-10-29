// Builds ready-to-paste promotion drafts for a content file (no AI; text comes from the entry itself).
// Usage: node scripts/social-drafts.mjs src/content/case-studies/jakarta-indonesia.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/social-drafts.mjs <content file>'); process.exit(1); }

const src = fs.readFileSync(path.resolve(file), 'utf8');
const m = src.match(/^---\n([\s\S]*?)\n---/);
const fm = {};
for (const line of m[1].split('\n')) {
  const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
  if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
}
const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
const base = (cfg.match(/site:\s*'([^']+)'/) || [])[1]?.replace(/\/$/, '') ?? '';
const isTool = file.includes('/tools/');
const slug = path.basename(file, '.md');
const url = `${base}/${isTool ? 'tools' : 'case-studies'}/${slug}/`;
const themes = (fm.themes || fm.category || '').replace(/[\[\]]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
const tags = ['UrbanPlanning', 'ClimateAdaptation', ...themes.map((t) => ({ heat: 'UrbanHeat', flood: 'FloodResilience', coastal: 'SeaLevelRise', green: 'GreenInfrastructure', data: 'ClimateData', planning: 'ClimatePlanning' }[t])).filter(Boolean)];
const hashtags = [...new Set(tags)].map((t) => '#' + t).join(' ');

let linkedin, bluesky, newsletter, outreach, title;
if (isTool) {
  title = fm.title;
  linkedin = `New in the Urban Climate Tools catalog: ${fm.title}.

${fm.tagline}.

Category: ${fm.category} · Difficulty: ${fm.difficulty}
What you need to start and what you get out are listed on the page, with a link to the official tool.

${url}

${hashtags}`;
  bluesky = `New in the catalog: ${fm.title}. ${fm.tagline}. ${url}`;
  newsletter = `**${fm.title}** (${fm.category}): ${fm.tagline}. ${url}`;
  outreach = `Hello,\n\nWe've added ${fm.title} to Urban Climate Tools, a free catalog of verified urban climate-adaptation tools and case studies: ${url}\n\nIf anything on the page is out of date or wrong, please tell us and we will fix it quickly. Thank you for making the tool available.\n`;
} else {
  title = `${fm.city}: ${fm.title}`;
  const stat = fm.statValue && fm.statLabel ? `Key figure: ${fm.statValue} ${fm.statLabel}.\n\n` : '';
  linkedin = `${fm.city}, ${fm.country}: ${fm.title}

${fm.tagline}.

${stat}The case study lists its sources and says plainly what is still uncertain.

${url}

${hashtags}`;
  bluesky = `${fm.city}: ${fm.tagline}. Sourced case study: ${url}`;
  newsletter = `**${fm.city}, ${fm.country}**: ${fm.tagline}. ${url}`;
  outreach = `Hello,\n\nWe've published a case study on ${fm.city}'s work on this topic in Urban Climate Tools, a free catalog of verified urban climate-adaptation examples: ${url}\n\nEvery figure is linked to its source. If anything is out of date or incorrect, please tell us and we will correct it. We would also welcome pointers to newer data.\n`;
}
if (bluesky.length > 300) bluesky = bluesky.slice(0, 296) + '...';

console.log(`# Social drafts: ${title}

Image to attach: ${base}/og/${isTool ? 'tools' : 'case-studies'}-${slug}.png

## LinkedIn
${linkedin}

## Bluesky (${bluesky.length}/300 characters)
${bluesky}

## Newsletter item
${newsletter}

## Outreach note (featured organisation)
${outreach}`);
