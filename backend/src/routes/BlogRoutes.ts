import { Router } from "express";
import {
  createBlogPosts,
  deleteBlogPosts,
  editBlogPosts,
  getBlogPosts,
} from "../controllers/blogControllers";

export const blogRoutes = Router();

blogRoutes.get("/", getBlogPosts);
blogRoutes.post("/", createBlogPosts);
blogRoutes.put("/:postId", editBlogPosts);
blogRoutes.delete("/:postId", deleteBlogPosts);
