import { Route, Routes } from "react-router";

import PostsList from "../pages/PostsList";
import CreatePost from "../pages/CreatePosts";
import EditPost from "../pages/EditPosts";
import ViewPost from "../pages/ViewPost";

const MainRoutes = () => {
  return (
    <Routes>
      <Route index element={<PostsList />} />
      <Route path="posts" element={<CreatePost />} />
      <Route path="posts/:postId" element={<EditPost />} />
      <Route path="/:slug" element={<ViewPost />} />
    </Routes>
  );
};

export default MainRoutes;
