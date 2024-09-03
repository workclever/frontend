import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface TaskDetailState {
  loading: boolean;
}

const initialState: TaskDetailState = {
  loading: true,
};

export const taskDetailSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    loadTaskDetailStarted: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ taskId: number }>
    ) => {
      state.loading = true;
    },
    loadTaskDetailFinished: (state) => {
      state.loading = false;
    },
  },
});

export const { loadTaskDetailStarted, loadTaskDetailFinished } =
  taskDetailSlice.actions;

export const selectTaskLoading = (state: RootState) => state.taskDetail.loading;

export const taskDetailReducer = taskDetailSlice.reducer;
