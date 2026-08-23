import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// One folder per post: `src/content/blog/<slug>/index.md`, with that post's
	// images sitting next to it. The `/index` segment is dropped from the URL,
	// so the folder name is the slug.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// Optional link to the code behind the post, rendered under the title.
			// `.url()` means a malformed link fails the build rather than shipping.
			sourceUrl: z.url().optional(),
		}),
});

export const collections = { blog };
