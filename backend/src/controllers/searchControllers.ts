import { RequestHandler } from "express";
import { promises as fs } from "node:fs";

import { BlogPost } from "../types/BlogPost";
import { checkIfFileExists } from "../utils/fsUtils";
import { GetResponse } from "./blogControllers";

const filePath = "src/data/posts.json";

export const searchBlogPosts: RequestHandler<
  unknown,
  GetResponse,
  unknown,
  { q: string; page: string }
> = async (req, res, next) => {
  const query = req.query.q;
  const page = req.query.page;

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

    let filtered: BlogPost[] = [];
    if (query) {
      filtered = blogPosts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      filtered = blogPosts.filter((item) => item).slice(0, 15);
    }
    filtered.sort((a, b) => Number(b.bookmarked) - Number(a.bookmarked));

    const paginatedData = filtered.slice(startIndex, endIndex);

    const response = {
      currentPage: pageNo,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length,
      data: paginatedData,
    };

    return res.json(response);
  } catch (err) {
    next(err);
  }
};
