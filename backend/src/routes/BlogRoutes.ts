import { Router } from "express";
import {
  bookmarkBlogPost,
  createBlogPosts,
  deleteBlogPost,
  editBlogPost,
  getBlogPosts,
} from "../controllers/blogControllers";

export const blogRoutes = Router();

blogRoutes.get("/", getBlogPosts);
blogRoutes.post("/", createBlogPosts);
blogRoutes.put("/:postId", editBlogPost);
blogRoutes.delete("/:postId", deleteBlogPost);
blogRoutes.patch("/:postId/bookmark", bookmarkBlogPost);
