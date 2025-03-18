import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "node:fs";

import { BlogPost } from "../types/BlogPost";
import { checkIfFileExists } from "../utils/fsUtils";
import { blogPostValidation } from "../validations/blogPostValidator";

const filePath = "src/data/posts.json";

export type GetResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: BlogPost[];
};

export const getBlogPosts: RequestHandler<
  unknown,
  GetResponse,
  { page: string }
> = async (req, res, next) => {
  const { page } = req.query;

  const limit = 15;
  const pageNo = +page || 1;

  const startIndex = (pageNo - 1) * limit;
  const endIndex = pageNo * limit;

  if (!checkIfFileExists(filePath)) {
    return res.json({
      currentPage: pageNo,
      totalPages: 0,
      totalItems: 0,
      data: [],
    });
  }
  try {
    const data = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(data);
    blogPosts.sort((a, b) => Number(b.bookmarked) - Number(a.bookmarked));
    const paginatedData = blogPosts.slice(startIndex, endIndex);

    const response = {
      currentPage: pageNo,
      totalPages: Math.ceil(blogPosts.length / limit),
      totalItems: blogPosts.length,
      data: paginatedData,
    };

    return res.json(response);
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
  const result = blogPostValidation.safeParse(data);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid BlogPost data",
      details: result.error.format(),
    });
  }

  data.id = uuidv4();
  data.date = new Date();
  data.bookmarked = false;

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

export const editBlogPost: RequestHandler<
  { id: string },
  Partial<BlogPost>,
  Partial<BlogPost>
> = async (req, res, next) => {
  const { id } = req.params;
  const data: Partial<BlogPost> = req.body;

  const result = blogPostValidation.safeParse(data);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid BlogPost data",
      details: result.error.format(),
    });
  }

  try {
    const postsData = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(postsData);

    const updatedPosts = blogPosts.map((post) =>
      post.id === id ? { ...post, ...data } : post
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

export const deleteBlogPost: RequestHandler<
  { id: string },
  { success: boolean },
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  try {
    const postsData = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(postsData);

    const filteredPosts = blogPosts.filter((post) => post.id !== id);
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

export const bookmarkBlogPost: RequestHandler<
  { id: string },
  { success: boolean },
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  try {
    const postsData = await fs.readFile(filePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(postsData);

    const updatedPosts = blogPosts.map((post) =>
      post.id === id ? { ...post, bookmarked: !post.bookmarked } : post
    );

    try {
      await fs.writeFile(filePath, JSON.stringify(updatedPosts));

      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
  return res.json({ success: false });
};
