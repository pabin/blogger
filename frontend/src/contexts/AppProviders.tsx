// contexts/AllProviders.jsx
import { CommentProvider } from "./CommentContext";
import { MyComponentProps, PostProvider } from "./PostsContext";

export const AppProviders: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <PostProvider>
      <CommentProvider>{children}</CommentProvider>
    </PostProvider>
  );
};

export default AppProviders;
