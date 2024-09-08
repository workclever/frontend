import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { TaskType } from "@app/types/Project";

interface TaskDetailState {
  loading: boolean;
  selectedTaskId?: number;
}

const initialState: TaskDetailState = {
  loading: true,
};

export const taskDetailSlice = createSlice({
  name: "taskDetail",
  initialState,
  reducers: {
    loadTaskDetailStarted: (
      state: TaskDetailState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ task: TaskType }>
    ) => {
      state.loading = true;
    },
    loadTaskDetailFinished: (state: TaskDetailState) => {
      state.loading = false;
    },
    setSelectedTaskId: (
      state: TaskDetailState,
      action: PayloadAction<number>
    ) => {
      state.selectedTaskId = action.payload;
    },
  },
});

export const {
  loadTaskDetailStarted,
  loadTaskDetailFinished,
  setSelectedTaskId,
} = taskDetailSlice.actions;

export const selectTaskLoading = (state: RootState) => state.taskDetail.loading;
export const selectSelectedTaskId = (state: RootState) =>
  state.taskDetail.selectedTaskId;

export const taskDetailReducer = taskDetailSlice.reducer;
