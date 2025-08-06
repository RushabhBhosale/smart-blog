import { z } from "zod";

export const BlogSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type BlogInput = z.infer<typeof BlogSchema>;
