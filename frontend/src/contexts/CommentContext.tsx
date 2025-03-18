import React, { createContext, useContext, useState } from "react";

import {
  createCommentAPI,
  deleteCommentAPI,
  getCommentsAPI,
} from "../api/commentsAPIs";
import { Comment, CommentContextType } from "../types/Comment";
import { MyComponentProps } from "./PostsContext";

const CommentContext = createContext<CommentContextType | null>(null);

export const CommentProvider: React.FC<MyComponentProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getComments = async (postId: string) => {
    setLoading(true);
    try {
      const commentItems: Comment[] = await getCommentsAPI(postId);
      setComments(commentItems);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId: string, comment: Partial<Comment>) => {
    setLoading(true);
    try {
      const commentItem: Comment = await createCommentAPI(postId, comment);
      setComments((prev) => [...prev, commentItem]);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    setLoading(true);
    try {
      const response = await deleteCommentAPI(postId, commentId);
      const filtered = comments.filter((c: Comment) => c.id !== commentId);
      setComments(filtered);
      return response;
    } catch (err) {
      setError(err as string);
      return err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        addComment,
        getComments,
        deleteComment,
        loading,
        error,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => useContext(CommentContext);
