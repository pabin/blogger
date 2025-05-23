import { useReducer } from "react";
import { Link, useNavigate } from "react-router";

import { usePostContext } from "../contexts/PostsContext";
import { BlogPost } from "../types/BlogPost";
import {
  postInitialState,
  postReducer,
  PostReducerType,
} from "../reducers/PostsReducer";

const CreatePost = () => {
  const [post, dispatch] = useReducer<PostReducerType, Partial<BlogPost>>(
    postReducer,
    postInitialState
  );

  const postContext = usePostContext();
  const navigate = useNavigate();

  const onHandleSubmit = () => {
    postContext?.addPost(post);
    dispatch({ type: "RESET" });
    navigate("/");
  };

  // Convert comma-separated tags into an array
  const handleTagChange = (e) => {
    const tags = e.target.value.split(",");
    const tagsmapped = tags.filter((t: string) => t);
    dispatch({ type: "SET_TAGS", payload: tagsmapped });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          View All Blog Posts
        </Link>
      </div>

      <div className="max-w-3xl mx-auto mt-4 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Add New Blog Post
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">
              Post Title
            </label>
            <input
              type="text"
              // value={post.title}
              onChange={(e) =>
                dispatch({ type: "SET_TITLE", payload: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Author Name
            </label>
            <input
              type="text"
              // value={post.author}
              onChange={(e) =>
                dispatch({ type: "SET_AUTHOR", payload: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Content</label>
            <textarea
              rows="12"
              // value={post.content}
              onChange={(e) =>
                dispatch({ type: "SET_CONTENT", payload: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Write your blog content here..."
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              // value={tags}
              onChange={handleTagChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g. JavaScript, Web Development, React"
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={onHandleSubmit}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {postContext?.loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
