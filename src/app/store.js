import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../redux/slices/posts/postSlice';
import usersReducer from '../redux/slices/users/users';


export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer
  }
})