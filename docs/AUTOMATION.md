# Content automation

Goal: two case studies and two tools a month with minimal manual work, without giving up review. Nothing is published or posted without you.

## The loop

| Step | Who | What |
|---|---|---|
| 1. Plan | `content/calendar.json` | One entry per Tuesday (see `docs/CONTENT-CALENDAR.md`) |
| 2. Remind | GitHub Action, Mondays | Opens an issue "Due: <entry>" with the checklist (`calendar-reminder.yml`) |
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

Connect the GitHub repo to Cloudflare Pages in the dashboard (Workers & Pages > urbanclimatetools > Settings > Builds) so merges deploy automatically. Until then deploy manually: `npm run build && npx wrangler pages deploy dist --project-name urbanclimatetools`.

Note: share images are text rendered with system fonts, so they look slightly different on Cloudflare's build machines than locally. If that matters, build and commit `public/og` locally and remove `node scripts/generate-og.mjs &&` from the `build` script.

## Why nothing posts automatically

LinkedIn restricts posting through its API for personal profiles, and an unreviewed post carrying a wrong number would damage the site's main promise. Posting from the drafts takes about two minutes per entry. Bluesky auto-posting can be added later with an app password stored as a GitHub secret.
