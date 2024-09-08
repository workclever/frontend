import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { BoardViewType } from "../../types/Project";
import { ItemId } from "@app/pages/project/components/board/dnd/tree/types";

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
  tree: {
    expandedKeys: Record<ItemId, boolean>;
  };
}

const initialState: ProjectState = {
  boardFilters: {},
  boardViewType: {},
  tree: {
    expandedKeys: {
      "column-1": true,
      "column-2": true,
    },
  },
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
    expandedTreeItemBulk: (
      state: ProjectState,
      action: PayloadAction<ItemId[]>
    ) => {
      action.payload.map((id) => {
        if (typeof state.tree.expandedKeys[id] !== "undefined") {
          return;
        }
        state.tree.expandedKeys[id] = true;
      });
    },
    toggleExpandedTreeItem: (
      state: ProjectState,
      action: PayloadAction<ItemId>
    ) => {
      if (state.tree.expandedKeys[action.payload]) {
        state.tree.expandedKeys[action.payload] = false;
      } else {
        state.tree.expandedKeys[action.payload] = true;
      }
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
  expandedTreeItemBulk,
  toggleExpandedTreeItem,
} = projectSlice.actions;

export const selectSelectedProjectId = (state: RootState) =>
  state.project.selectedProjectId;

export const selectSelectedBoardId = (state: RootState) =>
  state.project.selectedBoardId;

export const selectBoardFilters = (state: RootState) =>
  state.project.boardFilters;

export const selectBoardViewType = (state: RootState) =>
  state.project.boardViewType[Number(state.project.selectedBoardId)] || "kanban";

export const selectTreeExpandedKeys = (state: RootState) =>
  state.project.tree.expandedKeys;

export const projectReducer = projectSlice.reducer;
