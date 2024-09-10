import { ColumnType } from "@app/types/Project";

export type DndColumnType = ColumnType & {
  items: number[];
};

export type ColumnMap = { [columnId: number]: DndColumnType };
