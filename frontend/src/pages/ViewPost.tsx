import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAtom } from "jotai";

import { useCommentContext } from "../contexts/CommentContext";
import { BlogPost } from "../types/BlogPost";
import { visitedPostsAtom } from "../atoms";
import { usePostContext } from "../contexts/PostsContext";

const ViewPost = () => {
  const [post, setPost] = useState<BlogPost>({});
  const [comment, setComment] = useState({ author: "", content: "" });
  const location = useLocation();
  const commentContext = useCommentContext();
  const postContext = usePostContext();
  const [visitedPosts, setPostVisit] = useAtom(visitedPostsAtom);

  // console.log("post : ", post);

  useEffect(() => {
    setPost(location.state);
    if (!visitedPosts.includes(location.state?.id)) {
      setPostVisit((prev) => [...prev, location.state.id]);
    }
  }, []);

  useEffect(() => {
    commentContext?.getComments(post.id);
  }, [post.id]);

  // Handle new comment submit
  const handleSubmit = () => {
    commentContext?.addComment(post.id, { ...comment, postId: post.id });
    setComment({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          View All Blog Posts
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-gray-500 text-sm mb-4">
        By {post.author} • {post.date}
        <button
          className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 ml-4 cursor-pointer"
          onClick={() => {
            postContext?.bookmarkPost(post.id);
            setPost((prev) => ({ ...prev, bookmarked: !prev.bookmarked }));
          }}
        >
          {post.bookmarked ? "Remove Bookmark" : "Bookmark Post"}
        </button>
      </div>
      <p className="text-gray-800 mb-8">{post.content}</p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {commentContext?.comments.length === 0 ? (
          <p className="text-gray-500 mb-4">No comments yet.</p>
        ) : (
          commentContext?.comments.map((comment) => (
            <div
              key={comment.id}
              className="flex justify-between items-start mb-4 border border-gray-300 p-4 rounded"
            >
              <div>
                <p className="font-medium text-gray-700">{comment.author}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
              <button
                onClick={() => {
                  commentContext.deleteComment(post.id, comment.id);
                }}
                className="bg-red-400 text-white px-3 py-1 rounded cursor-pointer h-fit"
              >
                {commentContext.loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        )}

        <form className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Add a Comment</h3>

          <input
            type="text"
            placeholder="Your Name"
            // value={comment.author}
            onChange={(e) => setComment({ ...comment, author: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            required
          />
          <textarea
            // value={comment.content}
            placeholder="Your Comment"
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            rows="3"
            required
          ></textarea>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewPost;
