import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { BoardViewType } from "@app/types/Project";
import { ItemId } from "@ozgurrgul/dragulax";
import { api } from "@app/services/api";

export type BoardFilters = {
  filterText?: string;
  userIds?: number[];
};

interface BoardState {
  selectedBoardId?: number;
  selectedBoardViewId?: number;
  loading: boolean;
  boardFilters: BoardFilters;
  boardViewType: {
    [boardId: number]: BoardViewType;
  };
  tree: {
    expandedKeys: Record<ItemId, boolean>;
  };
}

const initialState: BoardState = {
  loading: true,
  boardFilters: {},
  boardViewType: {},
  tree: {
    expandedKeys: {},
  },
};

type SetBoardFilterPayload<K extends keyof BoardFilters> = {
  key: K;
  value: BoardFilters[K];
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    loadBoardStarted: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<{ boardId: number; projectId: number }>
    ) => {
      state.loading = true;
    },
    loadBoardFinished: (state) => {
      state.loading = false;
    },
    setSelectedBoardId: (state, action: PayloadAction<number | undefined>) => {
      state.selectedBoardId = action.payload;
      state.boardFilters = {};
    },
    setSelectedBoardViewId: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.selectedBoardViewId = action.payload;
    },
    setBoardFilter: <K extends keyof BoardState["boardFilters"]>(
      state: BoardState,
      action: PayloadAction<SetBoardFilterPayload<K>>
    ) => {
      state.boardFilters[action.payload.key] = action.payload.value;
    },
    setBoardViewType: (state, action: PayloadAction<BoardViewType>) => {
      state.boardViewType[Number(state.selectedBoardId)] = action.payload;
    },
    expandedTreeItemBulk: (
      state: BoardState,
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
      state: BoardState,
      action: PayloadAction<ItemId>
    ) => {
      if (state.tree.expandedKeys[action.payload]) {
        state.tree.expandedKeys[action.payload] = false;
      } else {
        state.tree.expandedKeys[action.payload] = true;
      }
    },
  },
});

export const {
  loadBoardStarted,
  loadBoardFinished,
  setSelectedBoardId,
  setSelectedBoardViewId,
  setBoardFilter,
  setBoardViewType,
  expandedTreeItemBulk,
  toggleExpandedTreeItem,
} = boardSlice.actions;

export const selectBoardLoading = (state: RootState) => state.board.loading;

export const selectSelectedBoardId = (state: RootState) =>
  state.board.selectedBoardId;

export const selectBoardFilters = (state: RootState) =>
  state.board.boardFilters;

export const selectSelectedBoardViewId = (state: RootState) =>
  state.board.selectedBoardViewId;

export const selectSelectedBoardView = createSelector(
  [
    (state: RootState) => state,
    selectSelectedBoardId,
    selectSelectedBoardViewId,
  ],
  (state, selectedBoardId, selectedBoardViewId) => {
    if (!selectedBoardId || !selectedBoardViewId) {
      return undefined;
    }

    const boardViews =
      api.endpoints.listBoardViewsByBoardId.select(selectedBoardId)(state);

    return boardViews.data?.Data.find((r) => r.Id === selectedBoardViewId);
  }
);

export const selectBoardViewType = createSelector(
  [selectSelectedBoardView],
  (selectedBoardView) => selectedBoardView?.Config.Type
);

export const selectTreeExpandedKeys = (state: RootState) =>
  state.board.tree.expandedKeys;

export const boardReducer = boardSlice.reducer;
