export type BlogPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: Date;
  bookmarked: boolean;
};
