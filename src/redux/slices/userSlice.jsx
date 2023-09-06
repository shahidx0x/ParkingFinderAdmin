import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { loginUser, logOut, isLoading } = userSlice.actions;

export default userSlice.reducer;
