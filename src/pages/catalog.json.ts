import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

// Machine-readable catalog of everything published (plus the scheduled calendar).
// Derived from the content collections, so it can never drift from the site.
// Used by the Project Manager app and available to researchers as open data.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? '').replace(/\/$/, '');
  const [tools, studies] = await Promise.all([getCollection('tools'), getCollection('case-studies')]);

  const entries = [
    ...studies.map((s) => ({
      type: 'case-study',
      slug: s.id,
      title: s.data.title,
      tagline: s.data.tagline,
      url: `${base}/case-studies/${s.id}/`,
      city: s.data.city,
      country: s.data.country,
      continent: s.data.continent,
      themes: s.data.themes,
      tags: s.data.themes,
      toolsUsed: s.data.toolsUsed,
      published: s.data.published ?? null,
      status: 'published',
      image: s.data.image ? `${base}${s.data.image}` : null,
    })),
    ...tools.map((t) => ({
      type: 'tool',
      slug: t.id,
      title: t.data.title,
      tagline: t.data.tagline,
      url: `${base}/tools/${t.id}/`,
      city: null,
      country: null,
      continent: null,
      themes: [t.data.category],
      tags: [t.data.category, ...t.data.tags],
      difficulty: t.data.difficulty,
      license: t.data.license,
      published: t.data.published ?? null,
      status: 'published',
      image: null,
    })),
  ].sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''));

  // Scheduled entries from the content calendar that are not live yet.
  let scheduled: unknown[] = [];
  try {
    const cal = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/calendar.json'), 'utf8'));
    const live = new Set(entries.map((e) => e.slug));
    const slugify = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    scheduled = cal.entries
      .filter((e: any) => ![...live].some((slug) => slug.startsWith(slugify(String(e.title).split(' or ')[0].replace(/\(.*\)/, '')))))
      .map((e: any) => ({
        type: e.type,
        slug: null,
        title: e.title,
        tagline: e.angle,
        url: null,
        city: null,
        country: e.country ?? null,
        continent: e.continent ?? null,
        themes: String(e.themes ?? e.category ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
        tags: [],
        published: e.date,
        status: 'scheduled',
        image: null,
      }));
  } catch {
    /* calendar is optional */
  }

  const body = { generatedAt: new Date().toISOString(), site: base, count: entries.length, entries: [...entries, ...scheduled] };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json' } });
};
