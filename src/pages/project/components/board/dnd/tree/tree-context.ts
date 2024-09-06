import { createContext } from "react";

import {
  attachInstruction,
  extractInstruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item";
import { TreeAction, TreeItem } from "./types";

export type TreeContextValue = {
  dispatch: (action: TreeAction) => void;
  uniqueContextId: symbol;
  getPathToItem: (itemId: string) => string[];
  getMoveTargets: ({ itemId }: { itemId: string }) => TreeItem[];
  getChildrenOfItem: (itemId: string) => TreeItem[];
  registerTreeItem: (args: {
    itemId: string;
    element: HTMLElement;
  }) => void;
};

export const TreeContext = createContext<TreeContextValue>({
  dispatch: () => {},
  uniqueContextId: Symbol("uniqueId"),
  getPathToItem: () => [],
  getMoveTargets: () => [],
  getChildrenOfItem: () => [],
  registerTreeItem: () => {},
});

export type DependencyContext = {
  DropIndicator: typeof DropIndicator;
  attachInstruction: typeof attachInstruction;
  extractInstruction: typeof extractInstruction;
};

export const DependencyContext = createContext<DependencyContext>({
  DropIndicator: DropIndicator,
  attachInstruction: attachInstruction,
  extractInstruction: extractInstruction,
});