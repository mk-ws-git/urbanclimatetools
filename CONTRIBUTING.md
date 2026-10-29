# Contributing to Urban Climate Tools

Thanks for helping grow the catalog! This is an [Astro](https://astro.build) site where **every tool and every case study is a single Markdown file** in `src/content/`. Add a file, and the listing pages, search index, counts, and maps update automatically — no other code changes needed.

## Local development

**Prerequisites:** Node.js 22.12+ (or 24+).

```bash
npm install
npm run dev        # http://localhost:4321
npm run astro check   # type-check content against the schema
npm run build      # production build + Pagefind search index
```

## Add a tool

Create `src/content/tools/<slug>.md`. The `<slug>` becomes the URL (`/tools/<slug>`). Frontmatter must satisfy the `tools` schema in [`src/content.config.ts`](src/content.config.ts):

```yaml
---
title: "Tool Name"
tagline: "One-line description of what it does"
category: heat          # heat | flood | coastal | green | data | planning
tags: [heat, mapping, open-data]
license: Open-Source    # MIT | Apache-2.0 | GPL-3.0 | BSD-2-Clause | CC-BY-4.0 | Proprietary-Free | Open-Source
language: "Python"      # optional
homepage: "https://example.org"   # optional, must be a valid URL
github: "https://github.com/org/repo"  # optional
difficulty: intermediate           # beginner | intermediate | advanced
lastUpdated: "2026"
featured: false
dataInputs: ["What the tool takes in"]
outputs: ["What the tool produces"]
---

## Overview
Markdown body: what it is, key features, who it's for, getting started.
```

## Add a case study

Create `src/content/case-studies/<slug>.md` (convention: `city-country`, e.g. `barcelona-spain`). Frontmatter must satisfy the `case-studies` schema:

```yaml
---
city: "Barcelona"
country: "Spain"
continent: "Europe"
lat: 41.3874
lng: 2.1686
title: "Descriptive headline for the intervention"
tagline: "One-line summary"
themes: [heat, planning]
toolsUsed: ["i-tree", "climate-central"]   # must match existing tool slugs
population: "1.6 million"
year: 2016
impact: "Quantified outcome with a source-backed figure"
featured: false
image: "/images/cities/barcelona.jpg"   # optional — omit for a gradient hero fallback
imageAlt: "Barcelona superblock with pedestrianised street and trees"
imageCredit: "Photographer / source (if applicable)"
---

## Background / The intervention / Results / Lessons
```

### Notes
- **`toolsUsed`** entries must be existing tool slugs, or the build will flag a broken reference.
- **Images** go in `public/images/cities/<name>.jpg` and are referenced from frontmatter (`image:`). If you omit `image`, the page renders a branded gradient hero — fine for a first draft. Record attribution in [`docs/IMAGE-CREDITS.md`](docs/IMAGE-CREDITS.md).
- **Verify facts and URLs** against primary sources (city reports, peer-reviewed literature) before submitting.

## Submitting changes

1. Create a branch: `git checkout -b add/<slug>`
2. Add your `.md` file(s) and any images
3. Run `npm run astro check` and `npm run build` to confirm it compiles
4. Commit and open a pull request describing the tool/city and your sources

## Code of Conduct

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
