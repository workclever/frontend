import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import { easeInOut } from "@atlaskit/motion/curves";
import { mediumDurationMs } from "@atlaskit/motion/durations";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { ColumnType, TaskType } from "@app/types/Project";
import { useBoardContext } from "./board-context";
import { type ColumnContextProps, ColumnContext } from "./column-context";
import { DndColumnType } from "./types";
import { Card } from "./Card";

const columnStyles: React.CSSProperties = {
  width: "250px",
  backgroundColor: "#fafafa",
  borderRadius: "5px",
  transition: `background ${mediumDurationMs}ms ${easeInOut}`,
  position: "relative",
};

const stackStyles = {
  // allow the container to be shrunk by a parent height
  // https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#the-minimum-size-gotcha-11
  minHeight: "0",

  // ensure our card list grows to be all the available space
  // so that users can easily drop on en empty list
  flexGrow: 1,
};

const scrollContainerStyles: React.CSSProperties = {
  height: "100%",
  overflowY: "auto",
};

const cardListStyles: React.CSSProperties = {
  boxSizing: "border-box",
  minHeight: "100%",
  padding: "4px",
  gap: "6px",
};

const columnHeaderStyles: React.CSSProperties = {
  paddingInlineStart: "4px",
  paddingInlineEnd: "4px",
  paddingBlockStart: "2px",
  userSelect: "none",
};

/**
 * Note: not making `'is-dragging'` a `State` as it is
 * a _parallel_ state to `'is-column-over'`.
 *
 * Our board allows you to be over the column that is currently dragging
 */
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

// preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

const stateStyles: {
  [key in State["type"]]: React.CSSProperties | undefined;
} = {
  idle: {
    cursor: "grab",
  },
  "is-card-over": {
    backgroundColor: "#eaeaea",
  },
  "is-column-over": undefined,
  /**
   * **Browser bug workaround**
   *
   * _Problem_
   * When generating a drag preview for an element
   * that has an inner scroll container, the preview can include content
   * vertically before or after the element
   *
   * _Fix_
   * We make the column a new stacking context when the preview is being generated.
   * We are not making a new stacking context at all times, as this _can_ mess up
   * other layering components inside of your card
   *
   * _Fix: Safari_
   * We have not found a great workaround yet. So for now we are just rendering
   * a custom drag preview
   */
  "generate-column-preview": {
    isolation: "isolate",
  },
  "generate-safari-column-preview": undefined,
};

const isDraggingStyles: React.CSSProperties = {
  opacity: 0.4,
};

export const Column = memo(function Column({
  column,
  renderColumnHeader,
  renderCardItem,
  renderNewCardItem,
}: {
  column: DndColumnType;
  renderColumnHeader: (column: ColumnType) => React.ReactNode;
  renderCardItem: (item: TaskType) => React.ReactNode;
  renderNewCardItem: () => React.ReactNode;
}) {
  const columnId = column.Id;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);
    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current,
        },
      }),
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes("AppleWebKit") &&
            !navigator.userAgent.includes("Chrome");

          if (!isSafari) {
            setState({ type: "generate-column-preview" });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "generate-safari-column-preview",
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === "column"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          // skip react re-render if edge is not changing
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      })
    );
  }, [columnId, registerColumn, instanceId]);

  //   const stableItems = useRef(column.items);
  //   useEffect(() => {
  //     column.items = column.items;
  //   }, [column.items]);

  const getCardIndex = useCallback(
    (id: number) => {
      return column.items.findIndex((item) => item.Id === id);
    },
    [column]
  );

  const getNumCards = useCallback(() => {
    return column.items.length;
  }, [column]);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        ref={columnRef}
        style={{
          display: "flex",
          flexDirection: "column",
          ...columnStyles,
          ...stateStyles[state.type],
        }}
      >
        {/* This element takes up the same visual space as the column.
          We are using a separate element so we can have two drop targets
          that take up the same visual space (one for cards, one for columns)
        */}
        <div style={stackStyles} ref={columnInnerRef}>
          <div
            style={{
              ...stackStyles,
              ...(isDragging ? isDraggingStyles : {}),
            }}
          >
            <div style={columnHeaderStyles} ref={headerRef}>
              {renderColumnHeader(column)}
            </div>
            <div style={scrollContainerStyles} ref={scrollableRef}>
              <div style={cardListStyles}>
                {column.items.map((item) => (
                  <Card
                    key={item.Id}
                    item={item}
                    renderItem={() => renderCardItem(item)}
                  />
                ))}
                {renderNewCardItem()}
              </div>
            </div>
          </div>
        </div>
        {state.type === "is-column-over" && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={"4px"} />
        )}
      </div>
      {state.type === "generate-safari-column-preview"
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
});

const safariPreviewStyles: React.CSSProperties = {
  width: "250px",
  backgroundColor: "elevation.surface.sunken",
  borderRadius: "border.radius",
  padding: "4px",
};

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <div
      style={{
        ...columnHeaderStyles,
        ...safariPreviewStyles,
      }}
    >
      {column.Name}
    </div>
  );
}
