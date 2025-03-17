import { Comment } from "../types/Comment";

const HOST = "http://localhost:3000";

export const getCommentsAPI = async (postId: string) => {
  try {
    const response = await fetch(`${HOST}/posts/${postId}/comments`);
    return await response.json();
  } catch (err) {
    console.log("err fetching comments!!", err);
  }
};

export const createCommentAPI = async (
  postId: string,
  comment: Partial<Comment>
) => {
  try {
    const response = await fetch(`${HOST}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    return await response.json();
  } catch (err) {
    console.log("err adding comment!!", err);
  }
};

export const deleteCommentAPI = async (postId: string, commentId: string) => {
  try {
    const response = await fetch(
      `${HOST}/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (err) {
    console.log("err deleting comment!!", err);
  }
};
