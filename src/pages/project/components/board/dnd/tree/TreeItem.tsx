import React, {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import invariant from "tiny-invariant";
import FocusRing from "@atlaskit/focus-ring";
import {
  type Instruction,
  type ItemMode,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import type { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/types";
import { type TreeItem as TreeItemType } from "./types";
import { DependencyContext, TreeContext } from "./tree-context";
import { blue } from "@ant-design/colors";

const indentPerLevel = 8;

const outerButtonStyles: React.CSSProperties = {
  /**
   * Without this Safari renders white text on drag.
   */
  color: "currentColor",
  border: 0,
  width: "100%",
  position: "relative",
  background: "transparent",
  borderRadius: 3,
  // cursor: "pointer",
};

const outerHoverStyles: React.CSSProperties = {
  borderRadius: 3,
  // cursor: "pointer",
};

const innerDraggingStyles: React.CSSProperties = {
  opacity: 0.4,
};

const innerButtonStyles: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexDirection: "row",
  background: "transparent",
  borderRadius: 3,
};

const previewStyles: React.CSSProperties = {
  background: blue[0],
  borderRadius: 3,
  padding: 4,
};

const Preview: React.FC<{ item: TreeItemType }> = ({ item }) => {
  if ("ColumnId" in item.data) {
    return <div style={previewStyles}>{item.data.Title}</div>;
  }
  return <div style={previewStyles}>{item.data.Name}</div>;
};

const parentOfInstructionStyles = {
  background: "transparent",
};

function getParentLevelOfInstruction(instruction: Instruction): number {
  if (instruction.type === "instruction-blocked") {
    return getParentLevelOfInstruction(instruction.desired);
  }
  if (instruction.type === "reparent") {
    return instruction.desiredLevel - 1;
  }
  return instruction.currentLevel - 1;
}

function delay({
  waitMs: timeMs,
  fn,
}: {
  waitMs: number;
  fn: () => void;
}): () => void {
  let timeoutId: number | null = window.setTimeout(() => {
    timeoutId = null;
    fn();
  }, timeMs);
  return function cancel() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}

export const TreeItem = memo(function TreeItem({
  item,
  mode,
  level,
  index,
  renderItem,
}: {
  item: TreeItemType;
  mode: ItemMode;
  level: number;
  index: number;
  renderItem: (data: TreeItemType, toggleOpen: () => void) => React.ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useState<
    "idle" | "dragging" | "preview" | "parent-of-instruction"
  >("idle");
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const cancelExpandRef = useRef<(() => void) | null>(null);

  const { dispatch, uniqueContextId, getPathToItem, registerTreeItem } =
    useContext(TreeContext);
  const { DropIndicator, attachInstruction, extractInstruction } =
    useContext(DependencyContext);
  const toggleOpen = useCallback(() => {
    dispatch({ type: "toggle", itemId: item.id });
  }, [dispatch, item]);

  useEffect(() => {
    invariant(buttonRef.current);
    return registerTreeItem({
      itemId: item.id,
      element: buttonRef.current,
    });
  }, [item.id, registerTreeItem]);

  const cancelExpand = useCallback(() => {
    cancelExpandRef.current?.();
    cancelExpandRef.current = null;
  }, []);

  const clearParentOfInstructionState = useCallback(() => {
    setState((current) =>
      current === "parent-of-instruction" ? "idle" : current
    );
  }, []);

  // When an item has an instruction applied
  // we are highlighting it's parent item for improved clarity
  const shouldHighlightParent = useCallback(
    (location: DragLocationHistory): boolean => {
      const target = location.current.dropTargets[0];

      if (!target) {
        return false;
      }

      const instruction = extractInstruction(target.data);

      if (!instruction) {
        return false;
      }

      const targetId = target.data.id;
      invariant(typeof targetId === "string");

      const path = getPathToItem(targetId);
      const parentLevel: number = getParentLevelOfInstruction(instruction);
      const parentId = path[parentLevel];
      return parentId === item.id;
    },
    [getPathToItem, extractInstruction, item]
  );

  useEffect(() => {
    invariant(buttonRef.current);

    function updateIsParentOfInstruction({
      location,
    }: {
      location: DragLocationHistory;
    }) {
      if (shouldHighlightParent(location)) {
        setState("parent-of-instruction");
        return;
      }
      clearParentOfInstructionState();
    }

    return combine(
      draggable({
        element: buttonRef.current,
        getInitialData: () => ({
          id: item.id,
          type: "tree-item",
          isOpenOnDragStart: item.isOpen,
          uniqueContextId,
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
            render: ({ container }) => {
              const root = ReactDOM.createRoot(container);
              root.render(<Preview item={item} />);
              return () => root.unmount();
            },
            nativeSetDragImage,
          });
        },
        onDragStart: ({ source }) => {
          setState("dragging");
          // collapse open items during a drag
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: "collapse", itemId: item.id });
          }
        },
        onDrop: ({ source }) => {
          setState("idle");
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: "expand", itemId: item.id });
          }
        },
      }),
      dropTargetForElements({
        element: buttonRef.current,
        getData: ({ input, element }) => {
          const data = { id: item.id };

          return attachInstruction(data, {
            input,
            element,
            indentPerLevel,
            currentLevel: level,
            mode,
            // TODO block
            // block: item.isDraft ? ["make-child"] : [],
          });
        },
        canDrop: ({ source }) =>
          source.data.type === "tree-item" &&
          source.data.uniqueContextId === uniqueContextId,
        getIsSticky: () => true,
        onDrag: ({ self, source }) => {
          const instruction = extractInstruction(self.data);

          if (source.data.id !== item.id) {
            // expand after 500ms if still merging
            if (
              instruction?.type === "make-child" &&
              item.children.length &&
              !item.isOpen &&
              !cancelExpandRef.current
            ) {
              cancelExpandRef.current = delay({
                waitMs: 500,
                fn: () => dispatch({ type: "expand", itemId: item.id }),
              });
            }
            if (instruction?.type !== "make-child" && cancelExpandRef.current) {
              cancelExpand();
            }

            setInstruction(instruction);
            return;
          }
          if (instruction?.type === "reparent") {
            setInstruction(instruction);
            return;
          }
          setInstruction(null);
        },
        onDragLeave: () => {
          cancelExpand();
          setInstruction(null);
        },
        onDrop: () => {
          cancelExpand();
          setInstruction(null);
        },
      }),
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDragStart: updateIsParentOfInstruction,
        onDrag: updateIsParentOfInstruction,
        onDrop() {
          clearParentOfInstructionState();
        },
      })
    );
  }, [
    dispatch,
    item,
    mode,
    level,
    cancelExpand,
    uniqueContextId,
    extractInstruction,
    attachInstruction,
    getPathToItem,
    clearParentOfInstructionState,
    shouldHighlightParent,
  ]);

  useEffect(
    function mount() {
      return function unmount() {
        cancelExpand();
      };
    },
    [cancelExpand]
  );

  const aria = (() => {
    if (!item.children.length) {
      return undefined;
    }
    return {
      "aria-expanded": item.isOpen,
      "aria-controls": `tree-item-${item.id}--subtree`,
    };
  })();

  const getConditionalStyles = (): React.CSSProperties => {
    switch (state) {
      case "dragging":
        return innerDraggingStyles;
      case "parent-of-instruction":
        return parentOfInstructionStyles;
      default:
        return {};
    }
  };

  return (
    <Fragment>
      <div
        style={{
          position: "relative",
          ...(state === "idle" ? outerHoverStyles : {}),
        }}
      >
        <FocusRing isInset>
          <button
            {...aria}
            id={`tree-item-${item.id}`}
            ref={buttonRef}
            type="button"
            style={{
              ...outerButtonStyles,
              paddingLeft: level * indentPerLevel,
            }}
            data-index={index}
            data-level={level}
          >
            <div
              style={{
                ...innerButtonStyles,
                ...getConditionalStyles(),
              }}
            >
              {/* <Icon item={item} onClick={toggleOpen} /> */}
              {renderItem(item, toggleOpen)}
              {/* <span style={labelStyles}>Item {item.data.}</span>
              <small style={idStyles}>
                <code style={debugStyles}>({mode})</code>
              </small> */}
            </div>
            {instruction ? <DropIndicator instruction={instruction} /> : null}
          </button>
        </FocusRing>
      </div>
      {item.children.length && item.isOpen ? (
        <div id={aria?.["aria-controls"]}>
          {item.children.map((child, index, array) => {
            const childType: ItemMode = (() => {
              if (child.children.length && child.isOpen) {
                return "expanded";
              }

              if (index === array.length - 1) {
                return "last-in-group";
              }

              return "standard";
            })();
            return (
              <TreeItem
                item={child}
                key={child.id}
                level={level + 1}
                mode={childType}
                index={index}
                renderItem={renderItem}
              />
            );
          })}
        </div>
      ) : null}
    </Fragment>
  );
});
