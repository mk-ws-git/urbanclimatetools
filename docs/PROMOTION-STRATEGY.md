# Promotion strategy

_Last updated: 2026-10-29_

## Positioning

**Urban Climate Tools is the place to find verified, sourced examples of what cities and tools actually do about climate.** The edge over a search result or a blog post is trust: every case study lists its sources, every figure is checked, and caveats are stated. Lead with that in all promotion. A fact-checking pass on this site already found fabricated figures in early content, which is exactly why a "verified" claim has value and why accuracy cannot slip.

## Audiences, in priority order

1. **Practitioners:** city sustainability and resilience staff, planners, consultants, NGO analysts. Want "who did this, with what tool, what happened".
2. **Researchers and students:** want citable summaries and links to primary sources.
3. **Tool makers and city offices featured on the site:** they amplify content about themselves, so each entry is also an outreach opportunity.
4. **Hiring managers and peers** (this is also your portfolio): want to see engineering quality, open-source practice and content discipline.

## Channels

| Channel | Why | Format | Effort |
|---|---|---|---|
| LinkedIn (personal profile) | Where planners and consultants are; also your portfolio audience | One post per new entry: key figure image, 3 to 4 lines, link, tag the city office or tool maker where possible | Automated draft, you post or approve |
| Bluesky | Active climate science and urbanism community; easy API | Same text, shorter; link card shows the share image | Fully automatable |
| Newsletter (Buttondown or similar, free tier) | Owned audience that survives platform changes | Monthly "4 new entries" roundup | Auto-generated draft, you send |
| Search (Google, Bing) | Long-term, compounding traffic from queries like "urban heat island case studies" | Sitemap, structured data, one clear page per entry | One-time setup, then free |
| Directories and lists | Backlinks and discovery | Submit to adaptation directories and "awesome" GitHub lists | One-time, then per milestone |
| Communities (r/urbanplanning, r/climate, planning and GIS forums) | Direct feedback | Share only when an entry is genuinely useful; follow each community's self-promotion rules | Occasional, manual |
| Outreach to featured organisations | They share and link | Short, polite note per entry: "we featured X, here is the page, tell us if anything is wrong" | Draft automated, you send |
| Dev write-up (dev.to, Hacker News "Show HN") | Reaches developers; strengthens the portfolio story | One post: "How I built a verified urban-climate catalog with Astro, Cloudflare and Claude" | Once, after launch settles |

Skip for now: paid ads, TikTok, X. Low return for this audience.

## Launch sequence

**Week 0 (before announcing):** LinkedIn re-scrape, Search Console and Bing sitemap submission, Cloudflare Web Analytics on, Git deploy connected, custom domain if bought, RSS feed and structured data added, "report an error" link on every page.

**Week 1:** Announce on LinkedIn (project post with the share card and 3 highlights), add the project to your profile, post on Bluesky, add to portfolio site, email 10 to 15 people directly (urbanists, planners, researchers you know) asking for honest feedback.

**Weeks 2 to 4:** Start the Tuesday cadence. Submit to directories. Send outreach notes for the first featured organisations. Post one thread on the fact-check story ("what I found when I audited my own site"): it shows rigour and is shareable.

**Month 2:** Newsletter launches. Publish the dev write-up. Review analytics and double down on the best-performing topics (likely heat and flood).

## Site changes that support promotion (engineering backlog)

- RSS/Atom feed for new entries
- JSON-LD structured data (Article for case studies, SoftwareApplication or Dataset for tools)
- "Last verified" date and "Cite this page" box on every entry
- "Report an error" link pre-filling a GitHub issue
- Share buttons and per-page share images (images already exist)
- Newsletter sign-up form
- Open-data export (JSON/CSV of the catalog) to attract researchers and "awesome list" inclusion

## Metrics (review monthly)

| Metric | Source | Early target (3 months) |
|---|---|---|
| Visitors and top pages | Cloudflare Web Analytics | Establish baseline, then +20% per month |
| Search impressions and clicks | Google Search Console | Pages indexed: all; first 100 clicks/month |
| Referrals by channel | Analytics | LinkedIn and Bluesky each a top-3 source |
| Newsletter subscribers | Newsletter tool | 100 |
| GitHub stars and issues | GitHub | Stars growing; at least 3 community error reports or suggestions |
| Featured organisations sharing a page | Manual tally | At least 3 |

## Risks

- **Accuracy:** one wrong number damages the "verified" promise. Keep the PR review gate and never auto-publish unreviewed content.
- **Over-claiming:** do not describe the catalog as comprehensive or authoritative until it is; "growing, sourced and checked" is honest.
- **Platform limits:** LinkedIn's posting API is restricted, so LinkedIn posts are drafted for you to publish.
- **Burnout:** the cadence is 4 items a month; if reviews slip, drop to 3 rather than lowering quality.
