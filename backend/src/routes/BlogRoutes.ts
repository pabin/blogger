import { Router } from "express";
import { createBlogPosts, getBlogPosts } from "../controllers/blogControllers";

export const blogRoutes = Router();

blogRoutes.get("/", getBlogPosts);
blogRoutes.post("/", createBlogPosts);
