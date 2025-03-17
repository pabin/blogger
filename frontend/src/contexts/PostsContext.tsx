import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { BlogPost, BlogPostResponse, PostContextType } from "../types/BlogPost";
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
  const [posts, setPosts] = useState<BlogPostResponse>({ data: [] });
  const [filteredPost, setFilteredPost] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosts = async (page: number) => {
    setLoading(true);
    try {
      const response: BlogPostResponse = await getPostsAPI(page);
      setPosts(response);

      const allAuthors: string[] = [];
      response.data.map((post: BlogPost) => {
        if (!allAuthors.includes(post.author)) {
          allAuthors.push(post.author);
        }
      });
      setAuthors(allAuthors);

      const allTags: string[] = [];
      response.data.map((post: BlogPost) => {
        post.tags?.map((tag: string) => {
          if (!allTags.includes(tag)) {
            allTags.push(tag);
          }
        });
      });
      setTags(allTags);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts(1);
  }, []);

  const addPost = async (post: Omit<BlogPost, "id">) => {
    setLoading(true);
    try {
      const postItem: BlogPost = await createPostAPI(post);
      setPosts((prev) => ({ ...prev, data: [...prev.data, postItem] }));
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
      const filtered = posts.data.filter((p: BlogPost) => p.id !== postId);
      filtered.push(postItem);
      setPosts((prev) => ({ ...prev, data: [...filtered] }));
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    setLoading(true);
    try {
      const response: BlogPostResponse = await searchPostAPI(query);

      setPosts(response);
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
      const filtered = posts.data.filter((p: BlogPost) => p.id !== id);
      setPosts((prev) => ({ ...prev, data: filtered }));
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const bookmarkPost = async (id: string) => {
    setLoading(true);
    try {
      await bookmarkPostAPI(id);
      const updated = posts.data.map((p) =>
        p.id === id ? { ...p, bookmarked: !p.bookmarked } : p
      );
      setPosts((prev) => ({ ...prev, data: updated }));
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const filterPost = async (author: string, tag: string) => {
    try {
      let filtered: BlogPost[] = [];
      if (author) {
        filtered = posts.data.filter(
          (p) => p.author.toLowerCase() === author.toLowerCase()
        );
      }

      if (tag) {
        for (const p of posts.data) {
          const filteredTags = p.tags.filter(
            (t) => t.toLowerCase() === tag.toLowerCase()
          );
          if (filteredTags) {
            filtered.push(p);
            break;
          }
        }
      }
      setFilteredPost(filtered);
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        authors,
        tags,
        filteredPost,
        getPosts,
        addPost,
        editPost,
        deletePost,
        searchPosts,
        bookmarkPost,
        filterPost,
        loading,
        error,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
