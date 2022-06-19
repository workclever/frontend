import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { BoardViewType } from "../types/Project";

export type BoardFilters = {
  searchText?: string;
  userIds?: number[];
};

interface ProjectState {
  selectedProjectId?: number;
  selectedBoardId?: number;
  selectedTaskId?: number;
  boardFilters: BoardFilters;
  boardViewType: {
    [boardId: number]: BoardViewType;
  };
}

const initialState: ProjectState = {
  boardFilters: {},
  boardViewType: {},
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProjectId: (state, action: PayloadAction<number>) => {
      state.selectedProjectId = action.payload;
    },
    setSelectedBoardId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedBoardId = action.payload;
      state.boardFilters = {};
    },
    setSelectedTaskId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedTaskId = action.payload;
    },
    setBoardFilter: (
      state,
      action: PayloadAction<{
        key: keyof ProjectState["boardFilters"];
        value: any;
      }>
    ) => {
      state.boardFilters[action.payload.key] = action.payload.value;
    },
    setBoardViewType: (state, action: PayloadAction<BoardViewType>) => {
      state.boardViewType[Number(state.selectedBoardId)] = action.payload;
    },
  },
});

export const {
  setSelectedProjectId,
  setSelectedBoardId,
  setSelectedTaskId,
  setBoardFilter,
  setBoardViewType,
} = projectSlice.actions;

export const selectSelectedProjectId = (state: RootState) =>
  state.project.selectedProjectId;

export const selectSelectedBoardId = (state: RootState) =>
  state.project.selectedBoardId;

export const selectSelectedTaskId = (state: RootState) =>
  state.project.selectedTaskId;

export const selectBoardFilters = (state: RootState) =>
  state.project.boardFilters;

export const selectBoardViewType = (state: RootState) =>
  state.project.boardViewType[Number(state.project.selectedBoardId)] ||
  "kanban";

export const projectReducer = projectSlice.reducer;
