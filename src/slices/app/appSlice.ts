import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface AppState {
  loading: boolean;
}

const initialState: AppState = {
  loading: true,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loadAppStarted: (state) => {
      state.loading = true;
    },
    loadAppFinished: (state) => {
      state.loading = false;
    },
    loadRecentProject: () => {},
  },
});

export const { loadAppStarted, loadAppFinished, loadRecentProject } =
  appSlice.actions;

export const selectRootState = (state: RootState) => state;

export const selectAppLoading = (state: RootState) => state.app.loading;

export const appReducer = appSlice.reducer;
