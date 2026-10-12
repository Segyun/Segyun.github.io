import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      draft: z.boolean().default(false),
      thumbnail: z.union([image(), z.string()]).optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date().optional(),
      order: z.number().optional(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      thumbnail: z.union([image(), z.string()]).optional(),
    }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    title: z.string().default('About'),
    description: z.string().default(''),
  }),
});

export const collections = { blog, projects, about };
