import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface BoardState {
  loading: boolean;
}

const initialState: BoardState = {
  loading: true,
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    loadBoardStarted: (state) => {
      state.loading = true;
    },
    loadBoardFinished: (state) => {
      state.loading = false;
    },
  },
});

export const { loadBoardStarted, loadBoardFinished } = boardSlice.actions;

export const selectBoardLoading = (state: RootState) => state.board.loading;

export const boardReducer = boardSlice.reducer;
