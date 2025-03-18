import { z } from "zod";

export const blogPostValidation = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content cannot be empty"),
  author: z.string().min(1, "Author name is required"),
  tags: z.array(z.string()),
  bookmarked: z.boolean(),
});
