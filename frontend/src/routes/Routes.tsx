import { Route, Routes } from "react-router";

import PostsList from "../pages/PostsList";

const MainRoutes = () => {
  return (
    <Routes>
      <Route index element={<PostsList />} />
    </Routes>
  );
};

export default MainRoutes;
