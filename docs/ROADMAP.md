# Urban Climate Tools — Roadmap

_Last updated: 2026-07-22_

A living plan for turning the catalog into a genuinely useful, well-trafficked resource. Organised **Now / Next / Later**, followed by deep-dives on making the site useful, analytics, promotion, and operations.

---

## Now (0–4 weeks)

- [x] **Reorganise repo** — single clean Astro project, fresh git, backup archived.
- [x] **Single source of truth** — case-study images in frontmatter; counts derived from collections.
- [x] **Content expansion** — 26 tools, 22 case studies across 6 continents (facts + URLs verified).
- [ ] **Real hero images** for the 9 new case studies (currently gradient placeholders). Source license-safe photos (Unsplash, Wikimedia Commons, city press kits) and record attribution in `docs/IMAGE-CREDITS.md`.
- [ ] **Deploy** to a host (see Deployment) and point `urbanclimatetools.org` at it.
- [ ] **Analytics** — add Google Analytics 4 (see Analytics section) so we have baseline traffic data from day one.
- [ ] **SEO baseline** — verify sitemap + robots, add per-page OpenGraph/Twitter meta, submit to Google Search Console + Bing Webmaster Tools.

## Next (1–3 months)

- [ ] **Interactive map** of all case studies on the homepage/dedicated page (Leaflet is already wired on detail pages).
- [ ] **Tool comparison view** — select 2–4 tools and compare category, license, difficulty, inputs/outputs side by side.
- [ ] **Better filtering** — combine category + difficulty + license + theme facets on `/tools` and `/case-studies`; make Pagefind search prominent.
- [ ] **"Tools used in this city" ↔ "Cities using this tool"** cross-linking (the data already supports the reverse lookup).
- [ ] **Content cadence** — publish 2–4 new case studies/tools per month (see backlog below).
- [ ] **CI** — GitHub Action running `astro build` + link check on every PR.
- [ ] **Newsletter capture** — a simple email signup (e.g. Buttondown/MailerLite) to build a returning audience.

## Later (3–12 months)

- [ ] **Contributor pipeline** — issue templates + a web submission form so practitioners can propose tools/case studies.
- [ ] **Tagging taxonomy** — a controlled vocabulary and tag index pages for SEO long-tail.
- [ ] **Quiz / "find the right tool"** guided finder (a `ToolFinder` component already exists — expand it).
- [ ] **Data downloads** — export the catalog as JSON/CSV for researchers (derive from collections at build).
- [ ] **Internationalisation** — the audience is global; consider translated summaries for high-traffic pages.
- [ ] **Retire the Jekyll GitHub repo** (`mk-ws-git/Urban-Climate-Tools`) once the new site is live and at parity.

---

## Making the site useful for visitors

Visitors are mostly planners, researchers, students, and NGO staff looking for _"a tool for X problem in Y kind of city."_ Prioritise:

1. **Findability** — strong search + faceted filters beat long lists. Surface Pagefind search in the header.
2. **Decision support** — the comparison view and the guided finder help people choose, not just browse.
3. **Trust** — every case study cites sources and real figures; keep it that way. Add a visible "last verified" date and a "report an issue" link.
4. **Actionability** — each tool page should answer "what do I need to start?" (already covered by `dataInputs` / getting-started) and link straight to the official tool.
5. **Cross-navigation** — connect tools ↔ case studies ↔ categories so one page leads to the next.

## Analytics (Google Analytics 4)

Plan: add a GA4 property and inject the gtag snippet site-wide via `BaseLayout.astro`, gated behind a `PUBLIC_GA_ID` env var so it only runs in production.

1. Create a GA4 property at analytics.google.com → copy the Measurement ID (`G-XXXXXXX`).
2. Add `PUBLIC_GA_ID=G-XXXXXXX` to the host's environment (and `.env` locally; `.env` is git-ignored).
3. Load `gtag.js` in `<head>` only when `import.meta.env.PUBLIC_GA_ID` is set.
4. Because GA4 uses cookies, add a lightweight **consent banner** for EU visitors (or configure GA4 Consent Mode) to stay GDPR-compliant.
5. Track key events: outbound clicks to official tool sites, search usage, and case-study reads.

> Note: GA4 needs a cookie/consent banner. If reducing that overhead later becomes attractive, Plausible or Cloudflare Web Analytics are cookieless drop-in alternatives.

## Promotion & visibility

- **SEO**: Search Console + Bing Webmaster; per-page OG images; descriptive titles/meta; internal linking; a tag taxonomy for long-tail queries ("urban heat tool for small cities", etc.).
- **Communities**: share individual case studies in venues where practitioners gather — r/urbanplanning, LinkedIn urban-resilience groups, ICLEI/C40 networks, academic urban-climate mailing lists.
- **Partnerships**: reach out to the tool makers featured (WRI, World Bank GFDRR, UN-Habitat) — they often amplify third-party catalogs that drive users to them.
- **Content marketing**: turn each new case study into a short LinkedIn/Bluesky post; compile a monthly "5 tools / 5 cities" roundup for the newsletter.
- **Backlinks**: get listed in climate-adaptation resource directories (weADAPT, CAKE, Adaptation Clearinghouse).

## Deployment

Static Astro output deploys anywhere. Recommended: **Cloudflare Pages** or **Netlify** (free tier, automatic builds from git, custom domain + HTTPS). Steps: push repo to GitHub → connect to host → build command `npm run build`, output `dist/` → add `urbanclimatetools.org` custom domain → set `PUBLIC_GA_ID` env var.

> The 26 MB source hero video in `assets/video/` should move to **Git LFS** before pushing, or be excluded from git (it's already served from `public/hero.mp4`).

---

## Content backlog

**Case studies** (candidates, verify before publishing): Norfolk (US — coastal, photos already in `assets/`), Minneapolis, Paris, London, Jakarta (re-adds from the old Jekyll site); plus Seoul (Cheonggyecheon), Medellín green corridors expansion, Lagos flood, Nairobi, Curitiba BRT/green.

**Tools** (candidates): ArcGIS Urban, LEED (rating system), OpenStreetMap-based flood tools, C40 Knowledge Hub tools, CoolClimate, Tygron, iTree extensions.
