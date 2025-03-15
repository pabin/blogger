import React, { createContext, useContext, useState, useEffect } from "react";

import { BlogPost, PostContextType } from "../types/BlogPost";
import { createPostAPI, editPostAPI, getPostsAPI } from "../api/postsAPIs";
import MainRoutes from "../routes/Routes";

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosts = async () => {
    setLoading(true);
    try {
      const postItems: BlogPost[] = await getPostsAPI();
      setPosts(postItems);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const addPost = async (post: Omit<BlogPost, "id">) => {
    setLoading(true);
    try {
      const postItem: BlogPost = await createPostAPI(post);
      setPosts((prev) => [...prev, postItem]);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (postId: string, post: Omit<BlogPost, "id">) => {
    setLoading(true);
    try {
      const postItem: BlogPost = await editPostAPI(postId, post);
      // need to remove existing and add new
      setPosts((prev) => [...prev, postItem]);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  // console.log("posts len: ", posts);

  return (
    <PostContext.Provider value={{ posts, addPost, editPost, loading, error }}>
      <MainRoutes />
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
