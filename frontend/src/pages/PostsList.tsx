import { Link, useNavigate } from "react-router";
import { usePostContext } from "../contexts/PostsContext";
import { useState } from "react";
import Modal from "../components/Modal";
import { slugify } from "../utils/slugify";

const PostsList = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const postContext = usePostContext();
  const navigate = useNavigate();

  if (postContext?.loading) {
    return (
      <div className="text-center text-lg font-semibold pt-4">
        loading blog posts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2 w-full max-w-4xl">
            <input
              type="text"
              placeholder="Search blog posts..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
              onClick={() => {
                postContext?.searchPosts(searchQuery);
                setOnSearch(true);
              }}
            >
              Search
            </button>
          </div>

          <Link
            to="/posts"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Add Post
          </Link>
        </div>

        {searchQuery && onSearch && (
          <>
            <button className="inline-flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-300 cursor-pointer">
              {searchQuery}
            </button>
            <button
              className="inline-flex items-center bg-red-300 text-gray-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-red-400 cursor-pointer"
              onClick={() => {
                postContext?.getPosts();
                setOnSearch(false);
              }}
            >
              X reset search
            </button>
          </>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Author</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {postContext?.posts.map((post) => (
              <tr
                key={post.id}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >
                <td
                  className="p-2"
                  onClick={() =>
                    navigate(`/${slugify(post.title)}`, { state: post })
                  }
                >
                  {post.title}
                </td>
                <td
                  className="p-2"
                  onClick={() =>
                    navigate(`/${slugify(post.title)}`, { state: post })
                  }
                >
                  {new Date(post.date).toDateString()}
                </td>
                <td
                  className="p-2"
                  onClick={() =>
                    navigate(`/${slugify(post.title)}`, { state: post })
                  }
                >
                  {post.author}
                </td>

                <td className="p-2 text-right space-x-2">
                  <div className="flex">
                    <Link
                      to={`/posts/${post.id}`}
                      state={{ post }}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setPostId(post.id);
                        setShowModal(true);
                      }}
                      className="bg-red-400 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      {postContext.loading ? "deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          postContext?.deletePost(postId);
          setShowModal(false);
        }}
        title="Confirm Post Deletion"
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
};

export default PostsList;
