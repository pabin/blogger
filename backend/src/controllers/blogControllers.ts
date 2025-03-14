import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "node:fs";

import { BlogPost } from "../types/BlogPost";
import { checkIfFileExists } from "../utils/fsUtils";

const filePath = "src/data/posts.json";

export const getBlogPosts: RequestHandler<
  { num: string },
  BlogPost[],
  unknown,
  unknown
> = async (req, res, next) => {
  if (!checkIfFileExists(filePath)) {
    return res.json([]);
  }
  try {
    const data = await fs.readFile(filePath, "utf8");
    const blogPost: BlogPost[] = JSON.parse(data);
    return res.json(blogPost);
  } catch (err) {
    next(err);
  }
};

export const createBlogPosts: RequestHandler<
  unknown,
  BlogPost,
  Partial<BlogPost>
> = async (req, res, next) => {
  const data: Partial<BlogPost> = req.body;
  data.id = uuidv4();
  data.date = new Date();

  const fileExists = checkIfFileExists(filePath);
  if (!fileExists) {
    try {
      await fs.writeFile(filePath, JSON.stringify([data]));
      return res.json(data as BlogPost);
    } catch (err) {
      next(err);
    }
  } else {
    const existingData = await fs.readFile(filePath, "utf8");
    const blogPost: BlogPost[] = JSON.parse(existingData);
    blogPost.push(data as BlogPost);
    try {
      await fs.writeFile(filePath, JSON.stringify(blogPost));
      return res.json(data as BlogPost);
    } catch (err) {
      next(err);
    }
  }
};

export const editBlogPosts: RequestHandler<
  { postId: string },
  Partial<BlogPost>,
  Partial<BlogPost>
> = async (req, res, next) => {
  const { postId } = req.params;
  const data: Partial<BlogPost> = req.body;

  try {
    const postsData = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(postsData);

    const updatedPosts = blogPosts.map((post) =>
      post.id === postId ? { ...post, ...data } : post
    );

    try {
      await fs.writeFile(filePath, JSON.stringify(updatedPosts));
      return res.json(data);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteBlogPosts: RequestHandler<
  { postId: string },
  { success: boolean },
  unknown
> = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const postsData = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(postsData);

    const filteredPosts = blogPosts.filter((post) => post.id !== postId);
    try {
      await fs.writeFile(filePath, JSON.stringify(filteredPosts));
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
  return res.json({ success: false });
};
