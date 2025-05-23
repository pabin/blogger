export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
};

export type BlogPostResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: BlogPost[];
};

export type PostContextType = {
  posts: BlogPostResponse;
  authors: string[];
  tags: string[];
  filteredPost: BlogPost[];
  getPosts: (page: number) => Promise<void>;
  addPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  editPost: (id: string, post: Omit<BlogPost, "id">) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  bookmarkPost: (id: string) => Promise<void>;
  filterPost: (author: string, tag: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};
