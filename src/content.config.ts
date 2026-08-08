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
  schema: z.object({
    title: z.string(),
    date: z.date(),
    kind: z.enum(['OC', '同人']),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    alt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['游戏', '动画', '影视', '视频', '书籍']),
    status: z.string().default('已完成'),
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

export const collections = { blog, memos, gallery, reviews };
