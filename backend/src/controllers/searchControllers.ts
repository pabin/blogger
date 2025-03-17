import { RequestHandler } from "express";
import { promises as fs } from "node:fs";

import { BlogPost } from "../types/BlogPost";
import { checkIfFileExists } from "../utils/fsUtils";

const filePath = "src/data/posts.json";

export const searchBlogPosts: RequestHandler<
  unknown,
  BlogPost[],
  unknown,
  { q: string }
> = async (req, res, next) => {
  const query = req.query.q;

  if (!checkIfFileExists(filePath)) {
    return res.json([]);
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

    return res.json(filtered);
  } catch (err) {
    next(err);
  }
};
