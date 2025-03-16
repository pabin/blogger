import { Link } from "react-router";
import { usePostContext } from "../context/PostsContext";

const PostsList = () => {
  const postContext = usePostContext();

  if (postContext?.loading) {
    return (
      <div className="text-center text-lg font-semibold pt-4">
        loading blog posts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 w-full max-w-4xl">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
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
              <tr key={post.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{post.title}</td>
                <td className="p-2">{new Date(post.date).toDateString()}</td>
                <td className="p-2">{post.author}</td>
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
                      // onClick={() => postContext.deletePost(post.id)}
                      className="bg-red-400 text-white px-3 py-1 rounded"
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
    </div>
  );
};

export default PostsList;
