import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface AppState {
  loading: boolean;
}

const initialState: AppState = {
  loading: true,
};

export const appSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    loadAppStarted: (state, _action: PayloadAction) => {
      state.loading = true;
    },
    loadAppFinished: (state, _action: PayloadAction) => {
      state.loading = false;
    },
  },
});

export const { loadAppStarted, loadAppFinished } = appSlice.actions;

export const selectAppLoading = (state: RootState) => state.app.loading;

export const appReducer = appSlice.reducer;
