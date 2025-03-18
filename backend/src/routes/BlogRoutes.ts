import { Router } from "express";
import {
  bookmarkBlogPost,
  createBlogPosts,
  deleteBlogPost,
  editBlogPost,
  getBlogPosts,
} from "../controllers/blogControllers";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/commentControllers";
import { searchBlogPosts } from "../controllers/searchControllers";
import { exportBlogPosts } from "../controllers/exportControllers";

export const blogRoutes = Router();

blogRoutes.get("/", getBlogPosts);
blogRoutes.post("/", createBlogPosts);
blogRoutes.put("/:id", editBlogPost);
blogRoutes.delete("/:id", deleteBlogPost);
blogRoutes.patch("/:id/bookmark", bookmarkBlogPost);

blogRoutes.get("/:id/comments", getComments);
blogRoutes.post("/:id/comments", createComment);
blogRoutes.delete("/:id/comments/:commentId", deleteComment);

blogRoutes.get("/search", searchBlogPosts);
blogRoutes.get("/export", exportBlogPosts);
