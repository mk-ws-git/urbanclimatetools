// Weekly traffic report from Cloudflare Web Analytics (the cookieless beacon
// already on the site). Writes analytics-report.md; the workflow
// (weekly-analytics.yml) posts it as a GitHub issue, which GitHub emails.
//
// Needs CLOUDFLARE_ANALYTICS_TOKEN (Account Analytics: Read, Account Settings:
// Read) and CLOUDFLARE_ACCOUNT_ID. Compares the last 7 full days to the 7 before.
//
// Try it locally:  CLOUDFLARE_ANALYTICS_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... node scripts/weekly-analytics.mjs
import fs from 'node:fs';

const TOKEN = process.env.CLOUDFLARE_ANALYTICS_TOKEN;
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const HOST = process.env.ANALYTICS_HOST || 'urbanclimatetools.pages.dev';
if (!TOKEN || !ACCOUNT) {
  console.error('Set CLOUDFLARE_ANALYTICS_TOKEN and CLOUDFLARE_ACCOUNT_ID.');
  process.exit(1);
}

const api = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok || json.success === false || json.errors?.length) {
    throw new Error(`${url} -> ${res.status} ${JSON.stringify(json.errors ?? json).slice(0, 400)}`);
  }
  return json;
};

// Web Analytics is keyed by a siteTag; find it from the host.
const sites = await api(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/rum/site_info/list?per_page=100`);
const site = sites.result.find((s) => s.host === HOST || s.ruleset?.zone_name === HOST || s.host?.includes(HOST));
if (!site) throw new Error(`No Web Analytics site found for ${HOST}. Found: ${sites.result.map((s) => s.host).join(', ')}`);
const siteTag = site.site_tag;

const day = 86400000;
const end = new Date(); end.setUTCHours(0, 0, 0, 0); // midnight today = end of last full day
const start = new Date(+end - 7 * day);
const prevStart = new Date(+end - 14 * day);
const iso = (d) => d.toISOString();

const gql = async (query) => {
  const json = await api('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', body: JSON.stringify({ query }) });
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors).slice(0, 400));
  return json.data.viewer.accounts[0];
};

const filter = (a, b) => `{ siteTag: "${siteTag}", datetime_geq: "${iso(a)}", datetime_lt: "${iso(b)}" }`;
const group = (name, dim, a, b, limit) => `
  ${name}: rumPageloadEventsAdaptiveGroups(filter: ${filter(a, b)}, limit: ${limit}, orderBy: [sum_visits_DESC]) {
    sum { visits }
    count
    dimensions { ${dim} }
  }`;
const total = (name, a, b) => `
  ${name}: rumPageloadEventsAdaptiveGroups(filter: ${filter(a, b)}, limit: 1) { sum { visits } count }`;

const data = await gql(`{
  viewer { accounts(filter: { accountTag: "${ACCOUNT}" }) {
    ${total('cur', start, end)}
    ${total('prev', prevStart, start)}
    ${group('pages', 'requestPath', start, end, 10)}
    ${group('countries', 'countryName', start, end, 10)}
    ${group('referrers', 'refererHost', start, end, 10)}
    ${group('devices', 'deviceType', start, end, 5)}
  } }
}`);

const sum = (rows) => ({ visits: rows?.[0]?.sum?.visits ?? 0, views: rows?.[0]?.count ?? 0 });
const cur = sum(data.cur);
const prev = sum(data.prev);
const delta = (a, b) => (b === 0 ? (a === 0 ? '–' : 'new') : `${a >= b ? '+' : ''}${Math.round(((a - b) / b) * 100)}%`);
const table = (rows, key, label) =>
  rows.length
    ? `| ${label} | Visits | Page views |\n|---|---:|---:|\n` +
      rows.map((r) => `| ${r.dimensions[key] || '(direct / none)'} | ${r.sum.visits} | ${r.count} |`).join('\n')
    : '_No data this week._';

const range = `${iso(start).slice(0, 10)} to ${iso(new Date(+end - day)).slice(0, 10)}`;
const md = `# Urban Climate Tools: weekly traffic, ${range}

**${cur.visits}** visits (${delta(cur.visits, prev.visits)} vs previous week: ${prev.visits}) · **${cur.views}** page views (${delta(cur.views, prev.views)} vs ${prev.views})

## Top pages
${table(data.pages, 'requestPath', 'Page')}

## Countries
${table(data.countries, 'countryName', 'Country')}

## Where visitors came from
${table(data.referrers, 'refererHost', 'Referrer')}

## Devices
${table(data.devices, 'deviceType', 'Device')}

_Cloudflare Web Analytics (cookieless; excludes most bots). Full dashboard: https://dash.cloudflare.com → Analytics & Logs → Web Analytics. Search Console: https://search.google.com/search-console_
`;
fs.writeFileSync('analytics-report.md', md);
fs.writeFileSync('analytics-title.txt', `📈 Weekly traffic — ${range}`);
console.log(md);
