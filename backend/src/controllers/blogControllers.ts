import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs/promises";

import { BlogPost } from "../types/BlogPost";
import { checkIfFileExists } from "../utils/fsUtils";

const filePath = "src/data/posts.json";

export const getBlogPosts: RequestHandler<
  { num: string },
  BlogPost[],
  unknown,
  unknown
> = async (req, res, next) => {
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
