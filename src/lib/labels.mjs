// Shared, framework-free label helpers.
// Imported by the detail pages (.astro) AND scripts/generate-og.mjs so the
// human-readable wording for categories / licenses never drifts between the
// on-page fact sheet and its Open Graph image.

/** Human-readable name for each tool/case-study category slug. */
export const CATEGORY_LABEL = {
  heat:     'Extreme Heat',
  flood:    'Flooding',
  coastal:  'Coastal & Sea Level',
  green:    'Green Infrastructure',
  data:     'Climate Data',
  planning: 'Planning & Policy',
};

export function categoryLabel(cat) {
  return CATEGORY_LABEL[cat] ?? cat;
}

/** Short cost/openness summary derived from the license enum. */
export function licenseSummary(license) {
  switch (license) {
    case 'CC-BY-4.0':
      return 'Free · Open data';
    case 'Proprietary-Free':
      return 'Free to use';
    default: // MIT, Apache-2.0, GPL-3.0, BSD-2-Clause, Open-Source
      return 'Free · Open-source';
  }
}

export const DIFFICULTY_LABEL = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

export function difficultyLabel(d) {
  return DIFFICULTY_LABEL[d] ?? d;
}
