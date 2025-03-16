import { Route, Routes } from "react-router";

import PostsList from "../pages/PostsList";
import CreatePost from "../pages/CreatePosts";
import EditPost from "../pages/EditPosts";

const MainRoutes = () => {
  return (
    <Routes>
      <Route index element={<PostsList />} />
      <Route path="posts" element={<CreatePost />} />
      <Route path="posts/:postId" element={<EditPost />} />
    </Routes>
  );
};

export default MainRoutes;
