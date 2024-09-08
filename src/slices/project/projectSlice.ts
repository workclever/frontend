import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface ProjectState {
  selectedProjectId?: number;
}

const initialState: ProjectState = {};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProjectId: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { setSelectedProjectId } = projectSlice.actions;

export const selectSelectedProjectId = (state: RootState) =>
  state.project.selectedProjectId;

export const projectReducer = projectSlice.reducer;
