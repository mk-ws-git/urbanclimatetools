# Urban Climate Tools

A searchable catalog of free and open-source **urban climate-adaptation tools** and real-world **city case studies**, built for planners, researchers, and practitioners.

Built with [Astro](https://astro.build) content collections — every tool and case study is a single Markdown file, and all listing pages, counts, and maps derive from those files (single source of truth).

## Tech stack

- **Astro 6** (static output) + **Tailwind CSS 4** + **MDX**
- **Pagefind** for static full-text search
- **Leaflet** for the case-study maps
- Content modelled as two typed collections (`tools`, `case-studies`) validated by a Zod schema

## Project structure

```text
src/
├── content/
│   ├── tools/            # one .md per tool          (schema: src/content.config.ts)
│   └── case-studies/     # one .md per city case study
├── content.config.ts     # Zod schema for both collections
├── lib/catalog.ts        # derived counts (toolCount, categories, continents…)
├── data/metrics.json     # EDITORIAL data only (climate stats, category labels)
├── components/  layouts/  pages/
└── styles/
public/                   # served assets (city photos, hero video, logos, favicons)
assets/                   # source/brand media not served directly (banners, icons, hi-res video)
docs/                     # image credits, deploy checklist, roadmap
```

## Commands

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm install`     | Install dependencies                            |
| `npm run dev`     | Start dev server at `localhost:4321`            |
| `npm run build`   | Build to `./dist/` and index search (Pagefind)  |
| `npm run preview` | Preview the production build locally            |
| `npm run astro check` | Type-check content and components           |

## Adding content

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide to adding a tool or case study. In short: drop a new `.md` file into the relevant `src/content/` folder with the required frontmatter — the site picks it up automatically.

## License

Code is licensed under the [MIT License](LICENSE). Case-study and tool descriptions are original summaries; third-party images retain their original licenses (see [docs/IMAGE-CREDITS.md](docs/IMAGE-CREDITS.md)).
