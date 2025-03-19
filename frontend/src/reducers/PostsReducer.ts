import { BlogPost } from "../types/BlogPost";

export type PostActionType = {
  type: string;
  payload: string;
};

export type PostReducerType = (
  state: BlogPost,
  action: PostActionType
) => BlogPost;

export const postInitialState: Partial<BlogPost> = {
  title: "",
  author: "",
  content: "",
  tags: [],
  bookmarked: false,
};

export const postReducer = function (
  state: Partial<BlogPost> = postInitialState,
  action: PostActionType
) {
  if (action.type == "SET_TITLE") {
    return { ...state, title: action.payload };
  } else if (action.type == "SET_AUTHOR") {
    return { ...state, author: action.payload };
  } else if (action.type == "SET_CONTENT") {
    return { ...state, content: action.payload };
  } else if (action.type == "SET_TAGS") {
    return { ...state, tags: action.payload };
  } else if (action.type == "RESET") {
    return postInitialState;
  } else {
    return state;
  }
};
