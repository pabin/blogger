import { BlogPost } from "../types/BlogPost";

export const HOST = "http://localhost:3000";

export const getPostsAPI = async (page: number) => {
  try {
    const response = await fetch(`${HOST}/posts/?page=${page}`);
    return await response.json();
  } catch (err) {
    console.log("err fetching posts!!", err);
    return err;
  }
};

export const createPostAPI = async (post: Omit<BlogPost, "id">) => {
  try {
    const response = await fetch(`${HOST}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return await response.json();
  } catch (err) {
    console.log("err adding post!!", err);
    return err;
  }
};

export const editPostAPI = async (
  postId: string,
  post: Omit<BlogPost, "id">
) => {
  try {
    const response = await fetch(`${HOST}/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return await response.json();
  } catch (err) {
    console.log("err updating post!!", err);
    return err;
  }
};

export const deletePostAPI = async (postId: string) => {
  try {
    const response = await fetch(`${HOST}/posts/${postId}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (err) {
    console.log("err deleting post!!", err);
    return err;
  }
};

export const searchPostAPI = async (query: string) => {
  try {
    const response = await fetch(`${HOST}/posts/search/?q=${query}`);
    return await response.json();
  } catch (err) {
    console.log("err searching post!!", err);
    return err;
  }
};

export const bookmarkPostAPI = async (postId: string) => {
  try {
    const response = await fetch(`${HOST}/posts/${postId}/bookmark`, {
      method: "PATCH",
    });
    return await response.json();
  } catch (err) {
    console.log("err bookmarking post!!", err);
    return err;
  }
};
