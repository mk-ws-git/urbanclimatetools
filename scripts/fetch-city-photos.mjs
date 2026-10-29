// Batch photo sourcing for case studies missing a hero image.
// Reuses the same licence-safe Wikimedia Commons logic as commons-photo.mjs,
// but runs unattended over a list of cities: for each it searches, picks the
// best licence-safe landscape photo, resizes to 1280px, saves it to
// public/images/cities/<file>.jpg, injects image/imageAlt/imageCredit into the
// case-study frontmatter, and appends a row to docs/IMAGE-CREDITS.md.
//
// Needs real network (Wikimedia) — run locally or on a CI runner, not in the
// proxy-restricted agent sandbox. Idempotent: skips a city whose image already
// exists and whose frontmatter already references it.
//
//   node scripts/fetch-city-photos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'UrbanClimateTools-photo-helper/1.0 (https://github.com/mk-ws-git/urbanclimatetools)';
const ALLOWED = /^(CC0|Public domain|PD|CC BY(?!-NC)(?!-ND)(-SA)?)/i;
const strip = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const enc = (u) => u.replace(/,/g, '%2C').replace(/\(/g, '%28').replace(/\)/g, '%29');

// slug→image basename, case-study markdown file, display name, fallback alt, search queries.
const CITIES = [
  { file: 'paris', md: 'paris-france.md', name: 'Paris France',
    alt: 'Rooftops and skyline of central Paris, France',
    queries: ['Paris rooftops skyline', 'Paris aerial view', 'Paris cityscape'] },
  { file: 'seoul', md: 'seoul-south-korea.md', name: 'Seoul South Korea',
    alt: 'The restored Cheonggyecheon stream running through central Seoul',
    queries: ['Cheonggyecheon', 'Cheonggyecheon stream Seoul', 'Seoul cityscape'] },
  { file: 'kigali', md: 'kigali-rwanda.md', name: 'Kigali Rwanda',
    alt: 'Green hills and valley wetlands around Kigali, Rwanda',
    queries: ['Kigali Rwanda cityscape', 'Kigali city view', 'Kigali Rwanda'] },
  { file: 'philadelphia', md: 'philadelphia-usa.md', name: 'Philadelphia USA',
    alt: 'Skyline of Philadelphia, Pennsylvania',
    queries: ['Philadelphia skyline', 'Philadelphia Pennsylvania skyline', 'Philadelphia city'] },
  { file: 'santiago', md: 'santiago-chile.md', name: 'Santiago Chile',
    alt: 'Santiago, Chile, with the Andes rising behind the city',
    queries: ['Santiago Chile skyline Andes', 'Santiago de Chile cityscape', 'Santiago Chile city'] },
  { file: 'accra', md: 'accra-ghana.md', name: 'Accra Ghana',
    alt: 'Cityscape of Accra, Ghana',
    queries: ['Accra Ghana cityscape', 'Accra skyline', 'Accra Ghana city'] },
  { file: 'doha', md: 'doha-qatar.md', name: 'Doha Qatar',
    alt: 'The skyline and corniche of Doha, Qatar',
    queries: ['Doha Qatar skyline', 'Doha corniche skyline', 'Doha Qatar cityscape'] },
];

async function api(params) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  return res.json();
}

const infoOf = (p) => {
  const ii = p.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  return {
    title: p.title, width: ii.width, height: ii.height, mime: ii.mime,
    licence: strip(m.LicenseShortName?.value), artist: strip(m.Artist?.value).replace(/^User:/, ''),
    page: ii.descriptionurl, thumb: ii.thumburl, desc: strip(m.ImageDescription?.value).slice(0, 90),
  };
};

async function bestCandidate(query) {
  const r = await api({
    action: 'query', generator: 'search', gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: 6, gsrlimit: 30, prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime', iiurlwidth: 1600,
  });
  const rows = Object.values(r.query?.pages || {}).map(infoOf).filter(Boolean)
    .filter((i) => i.mime === 'image/jpeg' && i.width >= 1800 && ALLOWED.test(i.licence)
      && i.width / i.height >= 1.3 && i.width / i.height <= 2.2 && i.thumb);
  // Prefer wide, landscape-ish images (closest to ~1.6 wins ties by width).
  rows.sort((a, b) => Math.abs(a.width / a.height - 1.6) - Math.abs(b.width / b.height - 1.6) || b.width - a.width);
  return rows[0] || null;
}

function injectFrontmatter(mdPath, city, pick) {
  let text = fs.readFileSync(mdPath, 'utf8');
  if (/^image:/m.test(text)) return false; // already wired
  const credit = `Photo: ${pick.artist}, ${pick.licence}, via Wikimedia Commons`;
  const alt = pick.desc && pick.desc.length > 8 ? pick.desc : city.alt;
  const lines =
    `image: "/images/cities/${city.file}.jpg"\n` +
    `imageAlt: ${JSON.stringify(alt)}\n` +
    `imageCredit: ${JSON.stringify(credit)}\n` +
    `imageCreditUrl: "${enc(pick.page)}"\n`;
  // Insert right after the `featured:` line, inside the frontmatter block.
  text = text.replace(/^(featured:.*\n)/m, `$1${lines}`);
  fs.writeFileSync(mdPath, text);
  return true;
}

let ok = 0;
const failed = [];
for (const city of CITIES) {
  const out = path.join(ROOT, 'public/images/cities', `${city.file}.jpg`);
  const mdPath = path.join(ROOT, 'src/content/case-studies', city.md);
  if (fs.existsSync(out) && /^image:/m.test(fs.readFileSync(mdPath, 'utf8'))) {
    console.log(`= ${city.file}: already has a photo, skipping`);
    ok++;
    continue;
  }
  let pick = null;
  for (const q of city.queries) {
    try { pick = await bestCandidate(q); } catch (e) { /* try next query */ }
    if (pick) break;
  }
  if (!pick) { failed.push(city.file); console.log(`✗ ${city.file}: no licence-safe landscape candidate`); continue; }

  const buf = Buffer.from(await (await fetch(pick.thumb, { headers: { 'User-Agent': UA } })).arrayBuffer());
  await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  injectFrontmatter(mdPath, city, pick);
  fs.appendFileSync(
    path.join(ROOT, 'docs/IMAGE-CREDITS.md'),
    `| ${city.name} | ${city.file}.jpg | ${pick.artist} | ${pick.licence} | ${enc(pick.page)} |\n`,
  );
  console.log(`✓ ${city.file}: ${pick.title} (${pick.width}x${pick.height}, ${pick.licence}, ${pick.artist})`);
  ok++;
}

console.log(`\nDone: ${ok}/${CITIES.length} have photos.` + (failed.length ? ` Retry with new queries: ${failed.join(', ')}` : ''));
