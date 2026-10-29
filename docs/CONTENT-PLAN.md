# Content plan and QA log

_Last updated: 2026-10-10_

## 1. QA scan results (2026-10-10)

**Fixed in this pass**

| Area | Problem | Fix |
|------|---------|-----|
| Tools | `Green Infrastructure Coalition` could not be verified (domain does not resolve) | Removed; replaced with the Georgetown Climate Center Green Infrastructure Toolkit |
| Tools | `Forest Carbon Calculator` (attributed to TNC) and `CityGreen` (attributed to Singapore's CUGE) could not be verified or were misattributed | Removed; references stripped from case studies |
| Tools | `City Energy Project Dashboard`, `Cool Roofs Calculator`, `Urban Heat Island Effect Tool` described tools that do not exist as stated | Rewritten as City Energy Project, DOE Roof Savings Calculator, EEA Urban Heat Island Modelling (slugs renamed) |
| Links | thinkhazard `www.` 404; Global Forest Watch now Global Nature Watch; InVEST, Open Climate Fix, CURB URLs redirected or generic | Updated |
| Links | Wrong GitHub orgs on i-Tree and NOAA SLR; Climate Central marked open source | Removed GitHub fields; licence corrected |
| Photos | 9 case studies had gradient placeholders | Added Wikimedia Commons photos (CC BY / CC BY-SA) |
| Credits | Attribution required by CC licences was not shown on pages | Credit now shown on every case-study hero; `docs/IMAGE-CREDITS.md` has author and licence for all 22 |
| Maps | CARTO basemap now returns an "API KEY REQUIRED" watermark | Switched to Esri gray canvas tiles |

**Link check:** 46 unique external URLs tested; all load except `nrdc.org` and `unep.org` which return 403 to scripts (bot protection, pages exist) and `github.com` rate limiting.

**Build checks (54 pages):** every page has a title, description, og:image, one `<h1>`, and alt text on all images. No broken internal links.

**Still open**

1. `ToolFinder` has a hardcoded list covering about half the tools. It should read the `tools` collection (single source of truth).
2. `toolsUsed` on case studies is "relevant tools", not "tools the city used". Several mappings are editorial. Either relabel the UI ("Relevant tools") or verify per city.
3. `citedBy` is `0` on every tool. Remove the field or populate it from real data.
4. The 13 original case studies (bde58e6) were not web-verified like the 9 newer ones. Spot-check headline figures and sources.
5. Several tool homepages point to a generic organisation page rather than the tool (Climate Central, NRDC, UNEP). Prefer the tool's own page.
6. `tools/*.md` licence field uses `Proprietary-Free` for "free to use, not open source". Consider renaming to `Free-to-use`.
7. No analytics or consent banner. (CI link-check added: see `.github/workflows`.)

## 2. Gap analysis of the catalog

- **Case studies:** 22 (Asia 6, Europe 6, North America 4, Africa 3, South America 2, Oceania 1).
- **Themes (a study can have several):** planning 17, green 15, flood 11, heat 11, data 10, coastal 4. **Coastal is thin.**
- **Tools by category:** data 7, planning 6, green 4, heat 3, flood 3, coastal 1. **Coastal, heat and flood are thin on tools.**
- **Tools not linked from any case study:** city-energy-project, curb-tool, google-eie, open-climate-fix, qgis, thinkhazard, un-habitat-crpt, unep-urban-resilience.
- **Under-represented regions:** Oceania (1), South America (2), Africa (3), Middle East and Central Asia (0), Pacific islands (0), Caribbean (0).

## 3. Priority backlog

Names below are candidates. Verify every fact and URL before publishing (see section 4).

### Case studies (target: +10, prioritising coastal, Africa, South America, Middle East)

| Priority | City | Theme | Why |
|----------|------|-------|-----|
| 1 | Paris, France | heat, green | Oasis schoolyards and cool-island routes; strong visuals and data |
| 2 | Seoul, South Korea | flood, green | Cheonggyecheon stream restoration; classic urban-heat/green case |
| 3 | Jakarta, Indonesia | coastal, flood | Subsidence and sea-wall plan; fills the coastal gap |
| 4 | Kigali, Rwanda | planning, green | Master plan and wetland protection; African secondary-city example |
| 5 | Santiago, Chile | heat, green | Urban forest and heat-vulnerability work; South America |
| 6 | New York City, USA | coastal, flood | Post-Sandy resilience programmes; large, well-documented |
| 7 | Dubai or Doha | heat | Extreme-heat adaptation; fills Middle East gap |
| 8 | Accra, Ghana | flood, planning | Informal-settlement drainage; second West African city |
| 9 | Auckland, New Zealand | coastal, flood | 2023 floods and managed retreat; second Oceania entry |
| 10 | Philadelphia, USA | flood, green | Green City, Clean Waters programme; mature green-infrastructure example |

Reserve list: Milan (Forestami), Stuttgart (cold-air corridors), Hamburg, Norfolk, Minneapolis, Chennai, Dar es Salaam, Quito, Buenos Aires, Sydney.

### Tools (target: +12, prioritising coastal, heat, flood)

| Priority | Candidate | Category | Notes |
|----------|-----------|----------|-------|
| 1 | NOAA Digital Coast | coastal | Free data and training hub for coastal planners |
| 2 | Climate Central Coastal Risk Screening Tool | coastal | Global elevation-based flood risk screening |
| 3 | EPA SWMM (Storm Water Management Model) | flood | Open-source standard for urban drainage modelling |
| 4 | FEMA Flood Map Service Center | flood | Official US flood hazard maps |
| 5 | GloFAS (Global Flood Awareness System) | flood | Global flood forecasting from Copernicus |
| 6 | CDC Heat and Health Tracker | heat | US heat-health indicators by county |
| 7 | Heat.gov / NIHHIS | heat | US federal heat resource hub and mapping campaigns |
| 8 | C40 Cool Cities resources | heat | Practitioner guidance across member cities |
| 9 | Tree Equity Score (American Forests) | green | Equity-weighted canopy gap tool |
| 10 | OSMnx | data | Open-source Python library for urban street networks |
| 11 | ICLEI ClearPath | planning | GHG inventory and climate action planning software |
| 12 | Urban Heat Island Explorer / LST via Google Earth Engine | heat | Open workflow for city land-surface temperature |

## 4. Verification checklist for every new entry

1. **Existence:** find the tool or programme on an official domain (not an aggregator). Record the URL.
2. **Facts:** each number or claim in `impact`, `statValue` and the body has a named source (city report, peer-reviewed paper, official statistics). Prefer two sources.
3. **Licence:** match the tool's real licence to the `license` enum. If it is free but not open source, use `Proprietary-Free`.
4. **Links:** run the link check (below). Prefer the tool's own page over an organisation home page.
5. **Photo:** source from Wikimedia Commons (CC BY, CC BY-SA, CC0 or public domain only). Record author, licence and file page in frontmatter (`imageCredit`, `imageCreditUrl`) and `docs/IMAGE-CREDITS.md`. No NC or ND licences.
6. **No fabricated data:** do not guess `citedBy`, user counts or dates. Omit the field if unknown.
7. **Build:** `npm run build` clean; page count increases as expected; check the page in dark and light mode.

## 5. Cadence and automation

- **Cadence:** 2 case studies and 2 tools per month; one verification pass on older entries per quarter.
- **CI (to add):** a GitHub Action running `npm run build` and a link checker on every push, plus a monthly scheduled link check that opens an issue on failures.
- **Photo helper (to add):** a script that searches Commons for a city, filters to allowed licences, and writes the credit frontmatter, so photo selection stays quick and consistent.
- **Freshness:** show a "last verified" date on each page and re-verify entries older than 12 months.
