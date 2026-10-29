---
description: Draft the next entry from the content calendar and open a pull request
---

Draft the next due entry from `content/calendar.json`, following the rules in `docs/CONTENT-PLAN.md`.

1. Run `node scripts/next-entry.mjs` to get the entry. If it names an alternative ("X or Y"), pick the better-documented one. If the subject cannot be verified, say so and choose the next reserve instead.
2. Research with web search and official pages. Confirm it exists. Collect only facts you can attach to a named source. Prefer two sources for headline figures. State uncertainty and conflicting figures on the page. Never invent numbers, dates or counts.
3. Match the format of an existing entry (case study: `src/content/case-studies/*.md`; tool: `src/content/tools/*.md`) and the schema in `src/content.config.ts`. Include a "Sources" section with links. Do not add `citedBy`.
4. Case study photo: run `node scripts/commons-photo.mjs search "<query>"`, look at candidates on Commons, then `get "<File:Title>" <name>`. Add the printed frontmatter lines (write an accurate `imageAlt`).
5. Tools: pick `license` from the enum honestly (`Proprietary-Free` means free to use, not open source). Use the tool's own page as `homepage`.
6. Run `npm run build` and fix errors. Run `node scripts/social-drafts.mjs <new file>` to confirm it works.
7. Create a branch `entry/<slug>`, commit (end the message with the Co-Authored-By line required for this repo), push, and open a pull request using the template. In the PR body, list each headline figure with its source URL and anything you could not verify.
8. Do NOT merge. The owner reviews and merges.
