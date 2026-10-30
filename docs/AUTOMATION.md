# Content automation

Goal: two case studies and two tools a month with minimal manual work, without giving up review. Nothing is published or posted without you.

## The loop

| Step | Who | What |
|---|---|---|
| 1. Plan | `content/calendar.json` | One entry per Tuesday (see `docs/CONTENT-CALENDAR.md`) |
| 2. Remind | GitHub Action, daily | Keeps one tracking issue current and posts nudge comments at 7, 3 and 1 days before each due date (`content-reminders.yml`) |
| 3. Draft | You run `/draft-next-entry` in Claude Code | Researches, writes the entry, finds a Commons photo, builds, opens a pull request |
| 4. Review | You | Check each figure against its source in the PR; merge |
| 5. Check | CI on the PR and on `main` | Build plus internal link check (`ci.yml`) |
| 6. Deploy | Merge | Deploys to Cloudflare Pages (see below) |
| 7. Promote | GitHub Action on merge | Opens a "Social drafts" issue with LinkedIn, Bluesky, newsletter and outreach text (`social-drafts.yml`) |
| 8. Maintain | GitHub Action, monthly | External link check; opens an issue if links break (`links.yml`) |

## Scripts

- `node scripts/next-entry.mjs [--within N] [--markdown]`: next unpublished calendar entry
- `node scripts/commons-photo.mjs search "<query>"` and `get "<File:Title>" <name>`: licence-safe photos with credits
- `node scripts/social-drafts.mjs <content file>`: promotion drafts built from the entry itself
- `npm run build`: generates share images, builds, indexes search

## Deploy

Merging to `main` runs `.github/workflows/deploy.yml`, which builds and deploys to the existing Cloudflare Pages project. It needs two repository secrets, `CLOUDFLARE_API_TOKEN` (permission: Cloudflare Pages, Edit) and `CLOUDFLARE_ACCOUNT_ID`; until they exist the job skips itself. Cloudflare cannot attach Git to a Pages project created by direct upload, which is why a workflow is used instead.

Share images are committed in `public/og`. `npm run build` does not regenerate them; run `npm run og` (or `npm run build:full`) after adding or changing entries, then commit the images.

Manual deploy still works: `npm run build:full && npx wrangler pages deploy dist --project-name urbanclimatetools`.

## Why nothing posts automatically

LinkedIn restricts posting through its API for personal profiles, and an unreviewed post carrying a wrong number would damage the site's main promise. Posting from the drafts takes about two minutes per entry. Bluesky auto-posting can be added later with an app password stored as a GitHub secret.

## Session notes — 2026-10-30

Catalogue at this point: **32 case studies / 34 tools** (all live on `main`). Work this session:

- **Content calendar reconciled** (`content/calendar.json`): dropped the six case studies that had already shipped (Paris, Seoul, Kigali, Santiago, Philadelphia, Accra) and rebuilt it as a clean forward schedule through 2027-04 on the alternating-Tuesday cadence (case study, then tool).
- **Photo-sourcing workflow added** — `.github/workflows/photos.yml` + `scripts/fetch-city-photos.mjs`: a `workflow_dispatch` Action that finds a licence-safe Wikimedia Commons photo for any case study missing a hero image, resizes it, wires `image`/`imageAlt`/`imageCredit` into the frontmatter, appends an `IMAGE-CREDITS.md` row, and commits. It runs on a GitHub runner (which can reach Commons; the agent sandbox cannot). Used it to photo the 7 new case studies.
- **Quick-win cleanups** merged earlier the same day: fixed the 2 `astro check` errors, wired `ToolFinder` to the collection, removed the always-zero `citedBy`, relabelled case-study "Tools used" → "Relevant tools", renamed the `Proprietary-Free` licence to `Free-to-use`, untracked the 26 MB source hero video. Also added `/catalog.csv` + download links on `/data`, and gated the Cloudflare Analytics beacon to production.
- **Custom-domain reminder**: a one-off reminder is scheduled for **2026-11-30** to point `urbanclimatetools.org` at Cloudflare Pages.
- **SEO**: `sitemap-index.xml` / `sitemap-0.xml` / `robots.txt` ship on every build. Submitting them to Google Search Console + Bing Webmaster is a manual account step (owner login + domain verification) — not automatable from here.

### Attempted: fully-automated draft-and-review scheduled task — NOT working, left DISABLED

Tried a daily Claude Code scheduled task (routine `trig_01NjoSmYQA8ZaQjHKYzxnYTq`) to auto-draft each entry ~7 days out as a PR and nudge at 3 and 1 days. **Validation fire failed**: the triggered fresh session starts with no repo attached and without GitHub connector tools (session tagged `config:no-git-repo`) and went idle in ~47 s without drafting — no branch, no PR, no file produced. The routine is **disabled** so it does not fire uselessly.

**To actually get the 7/3/1-day auto-draft + nudge, two viable paths:**

1. **Reliable reminders via GitHub Actions — DONE (2026-10-30).** Implemented as `content-reminders.yml` + `scripts/due-reminders.mjs`, replacing the old Monday-only `calendar-reminder.yml`. Runs daily, keeps one tracking issue ("📅 Content schedule — upcoming", label `content-schedule`) current, and posts a nudge comment at exactly 7, 3 and 1 days before each unpublished entry's due date (plus a one-time overdue ping). Drafting stays the existing `/draft-next-entry` command. Verified end-to-end: the Action creates/updates the issue, and the 7/3/1-day nudge logic is unit-tested.
2. **Fully-automated drafting.** Recreate the routine from the claude.ai Automations/Routines screen with the GitHub connector attached (so the fired session has GitHub tools), **or** move the git/PR step into a GitHub Action driven by an `ANTHROPIC_API_KEY` repo secret.

Either way the **review/approve surface stays one place: a pull request — merge = publish.**
