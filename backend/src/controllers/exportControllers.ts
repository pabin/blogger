import { RequestHandler } from "express";
import { promises as fs } from "node:fs";
import archiver from "archiver";
const json2md = require("json2md");

import { BlogPost } from "../types/BlogPost";

const postFilePath = "src/data/posts.json";

export const exportBlogPosts: RequestHandler<
  unknown,
  { success: boolean },
  unknown
> = async (req, res, next) => {
  try {
    const data = await fs.readFile(postFilePath, "utf8");
    const blogPosts: BlogPost[] = JSON.parse(data);

    res.attachment("blog-posts.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const post of blogPosts) {
      const title = { h1: post.title };
      const author = { h2: post.author };
      const date = { h3: post.date };
      const content = { p: post.content };
      const tags = { ol: post.tags ? [...post.tags] : [] };

      const fileContent = json2md([title, author, date, content, tags]);
      const buffer = Buffer.from(fileContent);
      archive.append(buffer, { name: `${post.id}.md` });
    }
    await archive.finalize();

    res.on("finish", () => {
      console.log("ZIP successfully sent and response finished!");
    });
  } catch (err) {
    next(err);
  }
};
