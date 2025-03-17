export type Comment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: Date;
};

export type CommentContextType = {
  comments: Comment[];
  getComments: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: Partial<Comment>) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};
