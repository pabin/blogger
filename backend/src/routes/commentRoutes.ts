import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/commentControllers";

export const commentRoutes = Router();

commentRoutes.get("/", getComments);
commentRoutes.post("/", createComment);
commentRoutes.delete("/:commentId", deleteComment);
