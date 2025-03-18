import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "node:fs";

import { checkIfFileExists } from "../utils/fsUtils";
import { Comment } from "../types/Comment";
import { commentValidation } from "../validations/commentValidator";

const filePath = "src/data/comments.json";

export const getComments: RequestHandler<
  { id: string },
  Comment[],
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  if (!checkIfFileExists(filePath)) {
    return res.json([]);
  }
  try {
    const data = await fs.readFile(filePath, "utf8");
    const comments: Comment[] = JSON.parse(data);
    const postComments = comments.filter((comment) => comment.postId === id);
    return res.json(postComments);
  } catch (err) {
    next(err);
  }
};

export const createComment: RequestHandler<
  { id: string },
  Comment,
  Partial<Comment>
> = async (req, res, next) => {
  const { id } = req.params;

  const data: Partial<Comment> = req.body;

  const result = commentValidation.safeParse(data);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid comment data",
      details: result.error.format(),
    });
  }

  data.id = uuidv4();
  data.date = new Date();
  data.postId = id;

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
  { id: string; commentId: string },
  { success: boolean },
  unknown
> = async (req, res, next) => {
  const { id, commentId } = req.params;

  try {
    const commentData = await fs.readFile(filePath, "utf8");
    const comments: Comment[] = JSON.parse(commentData);

    const filtered = comments.filter(
      (c) => c.id !== commentId && c.postId === id
    );
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
