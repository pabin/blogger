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
  const [filteredPost, setFilteredPost] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosts = async () => {
    setLoading(true);
    try {
      const postItems: BlogPost[] = await getPostsAPI();
      setPosts(postItems);

      const allAuthors: string[] = [];
      postItems.map((post) => {
        if (!allAuthors.includes(post.author)) {
          allAuthors.push(post.author);
        }
      });
      setAuthors(allAuthors);

      const allTags: string[] = [];
      postItems.map((post) => {
        post.tags?.map((tag) => {
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
      await bookmarkPostAPI(id);
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

  const filterPost = async (author: string, tag: string) => {
    try {
      let filtered: BlogPost[] = [];
      if (author) {
        filtered = posts.filter(
          (p) => p.author.toLowerCase() === author.toLowerCase()
        );
      }

      if (tag) {
        for (const p of posts) {
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
  // console.log("posts len: ", posts);

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
