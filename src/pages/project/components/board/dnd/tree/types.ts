import { ColumnType, TaskType } from "@app/types/Project";

export type ItemId = `column-${number}` | `task-${number}`;

export type TreeItem = {
  id: ItemId;
  children: TreeItem[];
  isOpen?: boolean;
  data: ColumnType | TaskType;
};
