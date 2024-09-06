import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import memoizeOne from "memoize-one";
import invariant from "tiny-invariant";
// import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import {
  type Instruction,
  type ItemMode,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  DependencyContext,
  TreeContext,
  TreeContextValue,
} from "./tree-context";
import { TreeItem } from "./TreeItem";
import { TreeItem as TreeItemType, ItemId } from "./types";
import { ColumnType } from "@app/types/Project";
import { treeUtils } from "./TreeUtils";

const treeStyles: React.CSSProperties = {
  display: "flex",
  boxSizing: "border-box",
  width: "100%",
  flexDirection: "column",
  backgroundColor: "#fff",
  // height: "calc(100vh - 90px)",
  overflowY: "auto",
};

type CleanupFn = () => void;

function createTreeItemRegistry() {
  const registry = new Map<string, { element: HTMLElement }>();

  const registerTreeItem = ({
    itemId,
    element,
  }: {
    itemId: string;
    element: HTMLElement;
  }): CleanupFn => {
    registry.set(itemId, { element });
    return () => {
      registry.delete(itemId);
    };
  };

  return { registry, registerTreeItem };
}

export const DndTreeBoard: React.FC<{
  items: TreeItemType[];
  toggleOpen: (item: TreeItemType) => void;
  renderItem: (item: TreeItemType) => React.ReactNode;
  renderNewColumnItem: () => React.ReactNode;
  renderNewCardItem: (column: ColumnType) => React.ReactNode;
  onMoveItem: (taskId: number, newColumnId: number) => void;
  onReorderItem: (
    taskId: number,
    targetTaskId: number,
    position: Instruction["type"]
  ) => void;
  onMakeChildInTask: (taskId: number, targetTaskId: number) => void;
  onMakeChildInColumn: (taskId: number, columnIn: number) => void;
}> = ({
  items,
  toggleOpen,
  renderItem,
  renderNewColumnItem,
  renderNewCardItem,
  onMoveItem,
  onReorderItem,
  onMakeChildInTask,
  onMakeChildInColumn,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { extractInstruction } = useContext(DependencyContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ registry, registerTreeItem }] = useState(createTreeItemRegistry);

  const data = items;
  const lastStateRef = useRef<TreeItemType[]>(data);

  useEffect(() => {
    lastStateRef.current = data;
  }, [data]);

  useEffect(() => {
    return () => {
      liveRegion.cleanup();
    };
  }, []);

  const getChildrenOfItem = useCallback((itemId: string) => {
    const data = lastStateRef.current;

    /**
     * An empty string is representing the root
     */
    if (itemId === "") {
      return data;
    }

    const item = treeUtils.find(data, itemId);
    invariant(item);
    return item.children;
  }, []);

  const context = useMemo<TreeContextValue>(() => {
    return {
      // dispatch: updateState,
      uniqueContextId: Symbol(JSON.stringify(items)),
      // memoizing this function as it is called by all tree items repeatedly
      // An ideal refactor would be to update our data shape
      // to allow quick lookups of parents
      getPathToItem: memoizeOne(
        (targetId: string) =>
          treeUtils.getPathToItem({
            current: lastStateRef.current,
            targetId,
          }) ?? []
      ),
      getChildrenOfItem,
      registerTreeItem,
    };
  }, [items, getChildrenOfItem, registerTreeItem]);

  useEffect(() => {
    invariant(ref.current);
    return combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === context.uniqueContextId,
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          if (source.data.type === "tree-item") {
            const itemId = source.data.id as ItemId;
            const target = location.current.dropTargets[0];
            const targetId = target.data.id as ItemId;

            const instruction: Instruction | null = extractInstruction(
              target.data
            );

            // Put to the new or current column
            if (instruction?.type === "make-child") {
              if (
                itemId.startsWith("task-") &&
                targetId.startsWith("column-")
              ) {
                const taskId = Number(itemId.split("-")[1]);
                const newColumnId = Number(targetId.split("-")[1]);
                onMoveItem(taskId, newColumnId);
              }
            }

            if (
              instruction?.type === "reorder-above" ||
              instruction?.type === "reorder-below"
            ) {
              if (itemId.startsWith("task-") && targetId.startsWith("task-")) {
                const taskId = Number(itemId.split("-")[1]);
                const targetTaskId = Number(targetId.split("-")[1]);
                onReorderItem(taskId, targetTaskId, instruction.type);
              }
            }

            if (instruction?.type === "make-child") {
              if (itemId.startsWith("task-") && targetId.startsWith("task-")) {
                const taskId = Number(itemId.split("-")[1]);
                const targetTaskId = Number(targetId.split("-")[1]);
                onMakeChildInTask(taskId, targetTaskId);
              } else if (
                itemId.startsWith("task-") &&
                targetId.startsWith("column-")
              ) {
                const taskId = Number(itemId.split("-")[1]);
                const columnId = Number(targetId.split("-")[1]);
                onMakeChildInColumn(taskId, columnId);
              }
            }

            // if (instruction !== null) {
            //   updateState({
            //     type: "instruction",
            //     instruction,
            //     itemId,
            //     targetId,
            //   });
            // }
          }
        },
      })
    );
  }, [
    context,
    extractInstruction,
    onMoveItem,
    onReorderItem,
    onMakeChildInTask,
    onMakeChildInColumn,
  ]);

  return (
    <TreeContext.Provider value={context}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={treeStyles} id="tree" ref={ref}>
          {data.map((item, index, array) => {
            const type: ItemMode = (() => {
              if (item.children.length && item.isOpen) {
                return "expanded";
              }

              if (index === array.length - 1) {
                return "last-in-group";
              }

              return "standard";
            })();

            return (
              <React.Fragment key={item.id}>
                <TreeItem
                  item={item}
                  level={0}
                  mode={type}
                  index={index}
                  renderItem={renderItem}
                  toggleOpen={toggleOpen}
                />
                {/* Type narrowing */}
                {"Color" in item.data && renderNewCardItem(item.data)}
              </React.Fragment>
            );
          })}
          {renderNewColumnItem()}
        </div>
      </div>
    </TreeContext.Provider>
  );
};
