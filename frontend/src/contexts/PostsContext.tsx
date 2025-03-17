import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { BlogPost, PostContextType } from "../types/BlogPost";
import {
  bookmarkPostAPI,
  createPostAPI,
  deletePostAPI,
  editPostAPI,
  getPostsAPI,
  searchPostAPI,
} from "../api/postsAPIs";

const PostContext = createContext<PostContextType | null>(null);

export type MyComponentProps = {
  children: ReactNode;
};
export const PostProvider: React.FC<MyComponentProps> = ({ children }) => {
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

  const bookmarkPost = async (id: string) => {
    setLoading(true);
    try {
      console.log("book", id);

      const res = await bookmarkPostAPI(id);
      console.log("res: ", res);

      const updated = posts.map((p) =>
        p.id === id ? { ...p, bookmarked: !p.bookmarked } : p
      );
      setPosts(updated);
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
        bookmarkPost,
        loading,
        error,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
