import { z } from "zod";

export const commentValidation = z.object({
  postId: z.string().uuid(),
  author: z.string().min(1, "Author is required"),
  content: z.string().min(1, "Content cannot be empty"),
});
