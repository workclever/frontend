import { TreeItem } from "./types";

export const treeUtils = {
  remove(data: TreeItem[], id: string): TreeItem[] {
    return data
      .filter((item) => item.id !== id)
      .map((item) => {
        if (treeUtils.hasChildren(item)) {
          return {
            ...item,
            children: treeUtils.remove(item.children, id),
          };
        }
        return item;
      });
  },

  insertBefore(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [newItem, item];
      }
      if (treeUtils.hasChildren(item)) {
        return {
          ...item,
          children: treeUtils.insertBefore(item.children, targetId, newItem),
        };
      }
      return item;
    });
  },

  insertAfter(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        return [item, newItem];
      }

      if (treeUtils.hasChildren(item)) {
        return {
          ...item,
          children: treeUtils.insertAfter(item.children, targetId, newItem),
        };
      }

      return item;
    });
  },

  insertChild(
    data: TreeItem[],
    targetId: string,
    newItem: TreeItem
  ): TreeItem[] {
    return data.flatMap((item) => {
      if (item.id === targetId) {
        // already a parent: add as first child
        return {
          ...item,
          // opening item so you can see where item landed
          isOpen: true,
          children: [newItem, ...item.children],
        };
      }

      if (!treeUtils.hasChildren(item)) {
        return item;
      }

      return {
        ...item,
        children: treeUtils.insertChild(item.children, targetId, newItem),
      };
    });
  },

  find(data: TreeItem[], itemId: string): TreeItem | undefined {
    for (const item of data) {
      if (item.id === itemId) {
        return item;
      }

      if (treeUtils.hasChildren(item)) {
        const result = treeUtils.find(item.children, itemId);
        if (result) {
          return result;
        }
      }
    }
  },

  getPathToItem({
    current,
    targetId,
    parentIds = [],
  }: {
    current: TreeItem[];
    targetId: string;
    parentIds?: string[];
  }): string[] | undefined {
    for (const item of current) {
      if (item.id === targetId) {
        return parentIds;
      }
      const nested = treeUtils.getPathToItem({
        current: item.children,
        targetId: targetId,
        parentIds: [...parentIds, item.id],
      });
      if (nested) {
        return nested;
      }
    }
  },

  hasChildren(item: TreeItem): boolean {
    return item.children.length > 0;
  },
};
