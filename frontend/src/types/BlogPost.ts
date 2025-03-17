export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
};

export type PostContextType = {
  posts: BlogPost[];
  getPosts: () => Promise<void>;
  addPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  editPost: (id: string, post: Omit<BlogPost, "id">) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  bookmarkPost: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};
