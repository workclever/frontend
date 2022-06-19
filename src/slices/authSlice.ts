import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  token?: string;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = undefined;
      localStorage.removeItem("token");
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;

export const authReducer = authSlice.reducer;
