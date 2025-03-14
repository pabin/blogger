import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "node:fs";

import { checkIfFileExists } from "../utils/fsUtils";
import { Comment } from "../types/Comment";

const filePath = "src/data/comments.json";

export const getComments: RequestHandler<
  { num: string },
  Comment[],
  unknown,
  unknown
> = async (req, res, next) => {
  if (!checkIfFileExists(filePath)) {
    return res.json([]);
  }
  try {
    const data = await fs.readFile(filePath, "utf8");
    const comments: Comment[] = JSON.parse(data);
    return res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const createComment: RequestHandler<
  unknown,
  Comment,
  Partial<Comment>
> = async (req, res, next) => {
  const data: Partial<Comment> = req.body;
  data.id = uuidv4();
  data.date = new Date();

  const fileExists = checkIfFileExists(filePath);
  if (!fileExists) {
    try {
      await fs.writeFile(filePath, JSON.stringify([data]));
      return res.json(data as Comment);
    } catch (err) {
      next(err);
    }
  } else {
    const existingData = await fs.readFile(filePath, "utf8");
    const comments: Comment[] = JSON.parse(existingData);
    comments.push(data as Comment);
    try {
      await fs.writeFile(filePath, JSON.stringify(comments));
      return res.json(data as Comment);
    } catch (err) {
      next(err);
    }
  }
};

export const deleteComment: RequestHandler<
  { commentId: string },
  { success: boolean },
  unknown
> = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const commentData = await fs.readFile(filePath, "utf8");
    const comments: Comment[] = JSON.parse(commentData);

    const filtered = comments.filter((comment) => comment.id !== commentId);
    try {
      await fs.writeFile(filePath, JSON.stringify(filtered));
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
  return res.json({ success: false });
};
