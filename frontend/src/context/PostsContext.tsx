import React, { createContext, useContext, useState, useEffect } from "react";

import { BlogPost, PostContextType } from "../types/BlogPost";
import {
  createPostAPI,
  deletePostAPI,
  editPostAPI,
  getPostsAPI,
  searchPostAPI,
} from "../api/postsAPIs";
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
      const filtered = posts.filter((p: BlogPost) => p.id !== postId);
      filtered.push(postItem);
      setPosts(filtered);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    setLoading(true);
    try {
      const postItems: BlogPost[] = await searchPostAPI(query);
      setPosts(postItems);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    try {
      await deletePostAPI(id);
      const filtered = posts.filter((p: BlogPost) => p.id !== id);
      setPosts(filtered);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  // console.log("posts len: ", posts);

  return (
    <PostContext.Provider
      value={{
        posts,
        getPosts,
        addPost,
        editPost,
        deletePost,
        searchPosts,
        loading,
        error,
      }}
    >
      <MainRoutes />
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
