import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { BoardViewType } from "../../types/Project";

export type BoardFilters = {
  filterText?: string;
  userIds?: number[];
};

interface ProjectState {
  selectedProjectId?: number;
  selectedBoardId?: number;
  boardFilters: BoardFilters;
  boardViewType: {
    [boardId: number]: BoardViewType;
  };
}

const initialState: ProjectState = {
  boardFilters: {},
  boardViewType: {},
};

type SetBoardFilterPayload<K extends keyof BoardFilters> = {
  key: K;
  value: BoardFilters[K];
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
    setBoardFilter: <K extends keyof ProjectState["boardFilters"]>(
      state: ProjectState,
      action: PayloadAction<SetBoardFilterPayload<K>>
    ) => {
      state.boardFilters[action.payload.key] = action.payload.value;
    },
    setBoardViewType: (state, action: PayloadAction<BoardViewType>) => {
      state.boardViewType[Number(state.selectedBoardId)] = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    goToProject: (_state, _action: PayloadAction<number>) => {},
  },
});

export const {
  setSelectedProjectId,
  setSelectedBoardId,
  setBoardFilter,
  setBoardViewType,
} = projectSlice.actions;

export const selectSelectedProjectId = (state: RootState) =>
  state.project.selectedProjectId;

export const selectSelectedBoardId = (state: RootState) =>
  state.project.selectedBoardId;

export const selectBoardFilters = (state: RootState) =>
  state.project.boardFilters;

export const selectBoardViewType = (state: RootState) =>
  state.project.boardViewType[Number(state.project.selectedBoardId)] || "tree";

export const projectReducer = projectSlice.reducer;
