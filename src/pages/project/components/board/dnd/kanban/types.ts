import { ColumnType, TaskType } from "@app/types/Project";

export type DndColumnType = ColumnType & {
  items: TaskType[];
};

export type ColumnMap = { [columnId: number]: DndColumnType };
