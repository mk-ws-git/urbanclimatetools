// Generates per-page Open Graph images (1200x630) for every tool and case study.
// Run: node scripts/generate-og.mjs   (sharp is a dependency of astro:assets)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og');
fs.mkdirSync(OUT, { recursive: true });

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// minimal frontmatter reader
function frontmatter(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    fm[kv[1]] = v;
  }
  return fm;
}

// wrap text into <=maxChars lines, emit tspans
function wrap(text, maxChars, x, y, lineHeight, max = 3) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; }
    else cur += ' ' + w;
    if (lines.length >= max) break;
  }
  if (cur && lines.length < max) lines.push(cur.trim());
  return lines
    .map((ln, i) => `<tspan x="${x}" y="${y + i * lineHeight}">${esc(ln)}</tspan>`)
    .join('');
}

function svg({ kicker, title, sub, stat, statLabel }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0c2a1f"/><stop offset="1" stop-color="#168A66"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="10" height="630" fill="#1D9E75"/>
  <text x="80" y="120" font-family="Helvetica,Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#7fbfa6">${esc((kicker || '').toUpperCase())}</text>
  <text font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="700" fill="#ffffff">${wrap(title, 30, 80, 210, 72)}</text>
  ${stat
    ? `<text x="80" y="470" font-family="Helvetica,Arial,sans-serif" font-size="72" font-weight="700" fill="#8ee3c4">${esc(stat)}</text>
       <text font-family="Helvetica,Arial,sans-serif" font-size="26" fill="#cfeee1">${wrap(statLabel || '', 60, 80, 512, 32, 2)}</text>`
    : `<text font-family="Helvetica,Arial,sans-serif" font-size="30" fill="#cfeee1">${wrap(sub || '', 58, 80, 440, 40, 2)}</text>`}
  <text x="80" y="590" font-family="Helvetica,Arial,sans-serif" font-size="24" font-weight="700" fill="#a7d7c5">Urban Climate Tools</text>
</svg>`;
}

async function gen(dir, prefix, mapFn) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const id = f.replace(/\.md$/, '');
    const fm = frontmatter(path.join(dir, f));
    const out = path.join(OUT, `${prefix}-${id}.png`);
    await sharp(Buffer.from(svg(mapFn(fm)))).png().toFile(out);
  }
  return files.length;
}

const nTools = await gen(
  path.join(ROOT, 'src/content/tools'),
  'tools',
  (fm) => ({ kicker: fm.category || 'Tool', title: fm.title, sub: fm.tagline })
);
const nCases = await gen(
  path.join(ROOT, 'src/content/case-studies'),
  'case-studies',
  (fm) => ({
    kicker: `${fm.city || ''}${fm.country ? ', ' + fm.country : ''}`,
    title: fm.title,
    sub: fm.tagline,
    stat: fm.statValue,
    statLabel: fm.statLabel,
  })
);

console.log(`Generated OG images: ${nTools} tools + ${nCases} case studies -> public/og/`);
