// Finds and downloads licence-safe photos from Wikimedia Commons.
//   node scripts/commons-photo.mjs search "Seoul Cheonggyecheon"
//   node scripts/commons-photo.mjs get "File:Cheonggyecheon.jpg" seoul
// `get` saves public/images/cities/<name>.jpg (1280 px wide) and prints the frontmatter lines + a credits row.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'UrbanClimateTools-photo-helper/1.0 (https://github.com/mk-ws-git/urbanclimatetools)';
const ALLOWED = /^(CC0|Public domain|PD|CC BY(?!-NC)(?!-ND)(-SA)?)/i;
const strip = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function api(params) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  return res.json();
}
const info = (p) => {
  const ii = p.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  return {
    title: p.title, width: ii.width, height: ii.height, mime: ii.mime,
    licence: strip(m.LicenseShortName?.value), artist: strip(m.Artist?.value).replace(/^User:/, ''),
    page: ii.descriptionurl, thumb: ii.thumburl, desc: strip(m.ImageDescription?.value).slice(0, 80),
  };
};
const enc = (u) => u.replace(/,/g, '%2C').replace(/\(/g, '%28').replace(/\)/g, '%29');

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'search') {
  const r = await api({ action: 'query', generator: 'search', gsrsearch: `${a} filetype:bitmap`, gsrnamespace: 6, gsrlimit: 30,
    prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: 400 });
  const rows = Object.values(r.query?.pages || {}).map(info).filter(Boolean)
    .filter((i) => i.mime === 'image/jpeg' && i.width >= 1800 && ALLOWED.test(i.licence)
      && i.width / i.height >= 1.25 && i.width / i.height <= 2.4);
  if (!rows.length) console.log('No licence-safe landscape candidates. Try another query.');
  for (const i of rows) console.log(`${i.title} | ${i.width}x${i.height} | ${i.licence} | ${i.artist.slice(0, 40)} | ${i.desc}`);
  console.log('\nLook at the images on Commons before choosing. Then run: get "<File:Title>" <name>');
} else if (cmd === 'get') {
  if (!a || !b) { console.error('Usage: get "<File:Title>" <name>'); process.exit(1); }
  const r = await api({ action: 'query', titles: a, prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: 1600 });
  const i = info(Object.values(r.query.pages)[0]);
  if (!i) { console.error('File not found.'); process.exit(1); }
  if (!ALLOWED.test(i.licence)) { console.error(`Licence "${i.licence}" is not allowed.`); process.exit(1); }
  const img = Buffer.from(await (await fetch(i.thumb, { headers: { 'User-Agent': UA } })).arrayBuffer());
  const out = path.join(ROOT, 'public/images/cities', `${b}.jpg`);
  await sharp(img).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  const page = enc(i.page);
  const credit = `Photo: ${i.artist}, ${i.licence}, via Wikimedia Commons`;
  const row = `| ${b} | ${b}.jpg | ${i.artist} | ${i.licence} | ${page} |`;
  fs.appendFileSync(path.join(ROOT, 'docs/IMAGE-CREDITS.md'), row + '\n');
  console.log(`Saved ${out}\n\nAdd to the case study frontmatter:\nimage: "/images/cities/${b}.jpg"\nimageAlt: "<describe what the photo shows>"\nimageCredit: "${credit}"\nimageCreditUrl: "${page}"\n\nAdded a row to docs/IMAGE-CREDITS.md`);
} else {
  console.log('Commands: search "<query>" | get "<File:Title>" <name>');
}
