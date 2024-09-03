import { TaskType } from "@app/types/Project";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavigateState {}

const initialState: NavigateState = {};

export const navigateSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    goToProject: (_state, _action: PayloadAction<number>) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    goToTask: (_state, _action: PayloadAction<TaskType>) => {},
  },
});

export const { goToProject, goToTask } = navigateSlice.actions;

export const navigateReducer = navigateSlice.reducer;
