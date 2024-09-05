import { treeUtils } from "./TreeUtils";
import { TreeItem, TreeAction, TreeState } from "./types";
import invariant from "tiny-invariant";

export function treeStateReducer(
  state: TreeState,
  action: TreeAction
): TreeState {
  return {
    data: dataReducer(state.data, action),
    lastAction: action,
  };
}

const dataReducer = (data: TreeItem[], action: TreeAction) => {
  console.log("action", action);

  const item = treeUtils.find(data, action.itemId);
  if (!item) {
    return data;
  }

  if (action.type === "instruction") {
    const instruction = action.instruction;

    if (instruction.type === "reparent") {
      const path = treeUtils.getPathToItem({
        current: data,
        targetId: action.targetId,
      });
      invariant(path);

      const desiredId = path[instruction.desiredLevel];
      let result = treeUtils.remove(data, action.itemId);
      result = treeUtils.insertAfter(result, desiredId, item);

      return result;
    }

    // the rest of the actions require you to drop on something else
    if (action.itemId === action.targetId) {
      return data;
    }

    if (instruction.type === "reorder-above") {
      let result = treeUtils.remove(data, action.itemId);
      result = treeUtils.insertBefore(result, action.targetId, item);
      return result;
    }

    if (instruction.type === "reorder-below") {
      let result = treeUtils.remove(data, action.itemId);
      result = treeUtils.insertAfter(result, action.targetId, item);
      return result;
    }

    if (instruction.type === "make-child") {
      let result = treeUtils.remove(data, action.itemId);
      result = treeUtils.insertChild(result, action.targetId, item);
      return result;
    }

    return data;
  }

  function toggle(item: TreeItem): TreeItem {
    if (!treeUtils.hasChildren(item)) {
      return item;
    }

    if (item.id === action.itemId) {
      return { ...item, isOpen: !item.isOpen };
    }

    return { ...item, children: item.children.map(toggle) };
  }

  if (action.type === "toggle") {
    return data.map(toggle);
  }

  if (action.type === "expand") {
    if (treeUtils.hasChildren(item) && !item.isOpen) {
      return data.map(toggle);
    }
    return data;
  }

  if (action.type === "collapse") {
    if (treeUtils.hasChildren(item) && item.isOpen) {
      return data.map(toggle);
    }
    return data;
  }

  return data;
};
