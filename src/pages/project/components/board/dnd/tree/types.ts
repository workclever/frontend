import { ColumnType, TaskType } from "@app/types/Project";
import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";

export type ItemId = `column-${number}` | `task-${number}`;

export type TreeItem = {
  id: ItemId;
  // isDraft?: boolean;
  children: TreeItem[];
  isOpen?: boolean;
  data: ColumnType | TaskType;
};

export type TreeAction =
  | {
      type: "instruction";
      instruction: Instruction;
      itemId: ItemId;
      targetId: ItemId;
    }
  | {
      type: "toggle";
      itemId: ItemId;
    }
  | {
      type: "expand";
      itemId: ItemId;
    }
  | {
      type: "collapse";
      itemId: ItemId;
    };

export type TreeState = {
  lastAction: TreeAction | null;
  data: TreeItem[];
};
