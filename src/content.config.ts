import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categoryEnum = z.enum(['heat', 'flood', 'coastal', 'green', 'data', 'planning']);
const licenseEnum  = z.enum(['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-2-Clause', 'CC-BY-4.0', 'Proprietary-Free', 'Open-Source']);

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title:        z.string(),
    tagline:      z.string(),
    category:     categoryEnum,
    tags:         z.array(z.string()),
    license:      licenseEnum,
    language:     z.string().optional(),
    homepage:     z.string().url().optional(),
    github:       z.string().url().optional(),
    difficulty:   z.enum(['beginner', 'intermediate', 'advanced']),
    lastUpdated:  z.string(),
    featured:     z.boolean().default(false),
    dataInputs:   z.array(z.string()),
    outputs:      z.array(z.string()),
    citedBy:      z.number().default(0),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    city:       z.string(),
    country:    z.string(),
    continent:  z.string(),
    lat:        z.number(),
    lng:        z.number(),
    title:      z.string(),
    tagline:    z.string(),
    themes:     z.array(z.string()),
    toolsUsed:  z.array(z.string()),
    population: z.string(),
    year:       z.number(),
    impact:     z.string(),
    featured:   z.boolean().default(false),
    imageAlt:   z.string().optional(),
  }),
});

export const collections = { tools, 'case-studies': caseStudies };
