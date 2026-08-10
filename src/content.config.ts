import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    date: z.date(),
    tags: z.array(z.string()).or(z.string()).optional().nullable(),
    sticky: z.number().default(0).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    draft: z.boolean().default(false).nullable(),
    toc: z.boolean().default(true).nullable(),
    donate: z.boolean().default(true).nullable(),
    comment: z.boolean().default(true).nullable(),
    ogImage: z.string().optional()
  }),
});

const memos = defineCollection({
  loader: glob({ base: './src/content/memos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    date: z.date(),
    mood: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    kind: z.enum(['oc', 'fanart']),
    tags: z.array(z.string()).default([]),
    image: image(),
    alt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['game', 'anime', 'movie', 'video', 'book']),
    status: z.string().default('completed'),
    rating: z.number().min(0).max(10).optional(),
    cover: z.string().optional(),
    creator: z.string().optional(),
    summary: z.string().optional(),
    notes: z.array(z.object({
      date: z.string().optional(),
      text: z.string(),
    })).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    about: z.object({
      portrait: z.string(),
      playlist: z.object({
        neteasePlaylistId: z.string(),
        autoplay: z.boolean().default(false),
      }),
      contacts: z.array(z.object({
        name: z.string(),
        href: z.string(),
      })).default([]),
      favorites: z.array(z.object({
        name: z.string(),
        author: z.string().optional(),
        category: z.enum(['game', 'anime', 'movie', 'video', 'book']),
      })).default([]),
      other: z.array(z.object({
        label: z.string(),
        value: z.string(),
        href: z.string().optional(),
      })).default([]),
      fun: z.array(z.object({
        title: z.string(),
        description: z.string().default(''),
        images: z.array(z.string()).default([]),
      })).default([]),
    }).optional(),
    updates: z.array(z.object({
      date: z.string(),
      text: z.string(),
    })).default([]),
  }),
});

export const collections = { blog, memos, gallery, reviews, pages };
