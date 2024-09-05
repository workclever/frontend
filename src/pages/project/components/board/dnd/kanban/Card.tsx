import React, {
  forwardRef,
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import invariant from "tiny-invariant";
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
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { useBoardContext } from "./board-context";
import { TaskType } from "@app/types/Project";

type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

const idleState: State = { type: "idle" };
const draggingState: State = { type: "dragging" };

const stateStyles: {
  [Key in State["type"]]: React.CSSProperties | undefined;
} = {
  idle: {
    cursor: "grab",
    // boxShadow: "elevation.shadow.raised",
  },
  dragging: {
    opacity: 0.4,
    // boxShadow: "elevation.shadow.raised",
  },
  // no shadow for preview - the platform will add it's own drop shadow
  preview: undefined,
};

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: TaskType;
  state: State;
};

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive({ closestEdge, item, state }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
          ...stateStyles[state.type],
        }}
      >
        {item.Title}
        {closestEdge && <DropIndicator edge={closestEdge} gap={"10px"} />}
      </div>
    );
  }
);

export const Card = memo(function Card({
  item,
  renderItem,
}: {
  item: TaskType;
  renderItem: () => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { Id } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(ref.current);
    return registerCard({
      cardId: Id,
      entry: {
        element: ref.current,
      },
    });
  }, [registerCard, Id]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: "card", itemId: Id, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: "preview", container, rect });
              return () => setState(draggingState);
            },
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({
        element: element,
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: "card", itemId: Id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== Id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== Id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [instanceId, item, Id]);

  return (
    <Fragment>
      <div
        ref={ref}
        style={{
          width: "100%",
          position: "relative",
          ...stateStyles[state.type],
        }}
      >
        {renderItem()}

        {closestEdge && <DropIndicator edge={closestEdge} gap={"10px"} />}
      </div>
      {state.type === "preview" &&
        ReactDOM.createPortal(
          <div
            style={{
              /**
               * Ensuring the preview has the same dimensions as the original.
               *
               * Using `border-box` sizing here is not necessary in this
               * specific example, but it is safer to include generally.
               */
              boxSizing: "border-box",
              width: state.rect.width,
              height: state.rect.height,
            }}
          >
            <CardPrimitive item={item} state={state} closestEdge={null} />
          </div>,
          state.container
        )}
    </Fragment>
  );
});
