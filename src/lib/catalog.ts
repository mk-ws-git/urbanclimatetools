import { getCollection } from 'astro:content';

/**
 * Single source of truth for catalog counts.
 * Everything here is DERIVED from the content collections at build time,
 * so the numbers can never drift from the actual tool / case-study files.
 */
export async function getCatalogStats() {
  const [tools, studies] = await Promise.all([
    getCollection('tools'),
    getCollection('case-studies'),
  ]);

  const continents = new Set(studies.map((s) => s.data.continent));
  const countries = new Set(studies.map((s) => s.data.country));

  const categoryCounts: Record<string, number> = {};
  for (const t of tools) {
    categoryCounts[t.data.category] = (categoryCounts[t.data.category] ?? 0) + 1;
  }

  return {
    toolCount: tools.length,
    caseStudyCount: studies.length,
    continentCount: continents.size,
    countryCount: countries.size,
    categoryCounts,
  };
}
