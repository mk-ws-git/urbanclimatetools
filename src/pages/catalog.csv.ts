import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Flat CSV of everything published — the spreadsheet-friendly sibling of
// catalog.json. Derived from the content collections, so it can never drift
// from the site. One row per tool / case study.

type Row = Record<string, string | null | undefined | string[]>;

const COLUMNS = [
  'type', 'slug', 'title', 'tagline', 'url',
  'city', 'country', 'continent',
  'category', 'themes', 'tags',
  'difficulty', 'license', 'toolsUsed', 'published',
] as const;

function cell(value: string | null | undefined | string[]): string {
  if (value == null) return '';
  const s = Array.isArray(value) ? value.join('; ') : String(value);
  // RFC 4180: quote when the value contains a comma, quote, or newline.
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? '').replace(/\/$/, '');
  const [tools, studies] = await Promise.all([
    getCollection('tools'),
    getCollection('case-studies'),
  ]);

  const rows: Row[] = [
    ...studies.map((s) => ({
      type: 'case-study',
      slug: s.id,
      title: s.data.title,
      tagline: s.data.tagline,
      url: `${base}/case-studies/${s.id}/`,
      city: s.data.city,
      country: s.data.country,
      continent: s.data.continent,
      category: '',
      themes: s.data.themes,
      tags: s.data.themes,
      difficulty: '',
      license: '',
      toolsUsed: s.data.toolsUsed,
      published: s.data.published ?? '',
    })),
    ...tools.map((t) => ({
      type: 'tool',
      slug: t.id,
      title: t.data.title,
      tagline: t.data.tagline,
      url: `${base}/tools/${t.id}/`,
      city: '',
      country: '',
      continent: '',
      category: t.data.category,
      themes: [t.data.category],
      tags: t.data.tags,
      difficulty: t.data.difficulty,
      license: t.data.license,
      toolsUsed: '',
      published: t.data.published ?? '',
    })),
  ].sort((a, b) => String(b.published ?? '').localeCompare(String(a.published ?? '')));

  const lines = [
    COLUMNS.join(','),
    ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(',')),
  ];

  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="urban-climate-tools-catalog.csv"',
    },
  });
};
