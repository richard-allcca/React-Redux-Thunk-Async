import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
})

// ======== SLICE =============

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return [...state, ...action.payload]
      })
  }
})

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;