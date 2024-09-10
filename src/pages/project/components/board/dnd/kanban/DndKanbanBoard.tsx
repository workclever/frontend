import React, { useCallback, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
// import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { ColumnMap } from "./types";
import { ColumnType } from "@app/types/Project";
import { createRegistry } from "./registry";
import { BoardContext, BoardContextValue } from "./board-context";
import Board from "./Board";
import { Column } from "./Column";

// type Outcome =
//   | {
//       type: "column-reorder";
//       columnId: number;
//       startIndex: number;
//       finishIndex: number;
//     }
//   | {
//       type: "card-reorder";
//       columnId: number;
//       startIndex: number;
//       finishIndex: number;
//     }
//   | {
//       type: "card-move";
//       finishColumnId: number;
//       itemIndexInStartColumn: number;
//       itemIndexInFinishColumn: number;
//     };

type Trigger = "pointer" | "keyboard";

// type Operation = {
//   trigger: Trigger;
//   outcome: Outcome;
// };

// type BoardState = {
//   lastOperation: Operation | null;
// };

export const DndKanbanBoard: React.FC<{
  dndColumnMap: ColumnMap;
  orderedColumnIds: number[];
  onReorderColumn: (orderedColumnIds: number[]) => void;
  onReorderTask: (columnId: number, orderedTaskIds: number[]) => void;
  onMoveCard: (
    taskId: number,
    finishColumnId: number,
    grouped: { [columnId: number]: number[] }
  ) => void;
  renderColumnHeader: (column: ColumnType) => React.ReactNode;
  renderCard: (cardId: number) => React.ReactNode;
  renderNewColumnItem: () => React.ReactNode;
  renderNewCardItem: (column: ColumnType) => React.ReactNode;
}> = ({
  dndColumnMap,
  orderedColumnIds,
  onReorderColumn,
  onReorderTask,
  onMoveCard,
  renderColumnHeader,
  renderCard,
  renderNewColumnItem,
  renderNewCardItem,
}) => {
  // const [data, setData] = useState<BoardState>({
  //   lastOperation: null,
  // });

  const [registry] = useState(createRegistry);
  // const { lastOperation } = data;

  // useEffect(() => {
  //   if (lastOperation === null) {
  //     return;
  //   }
  //   const { outcome, trigger } = lastOperation;

  //   if (outcome.type === "column-reorder") {
  //     const { startIndex, finishIndex } = outcome;

  //     const sourceColumn = dndColumnMap[orderedColumnIds[finishIndex]];

  //     const entry = registry.getColumn(sourceColumn.Id);
  //     triggerPostMoveFlash(entry.element);

  //     liveRegion.announce(
  //       `You've moved ${sourceColumn.Name} from position ${
  //         startIndex + 1
  //       } to position ${finishIndex + 1} of ${orderedColumnIds.length}.`
  //     );

  //     return;
  //   }

  //   if (outcome.type === "card-reorder") {
  //     const { columnId, startIndex, finishIndex } = outcome;

  //     const column = dndColumnMap[columnId];
  //     const item = column.items[finishIndex];

  //     const entry = registry.getCard(item);
  //     if (!entry) {
  //       return;
  //     }
  //     triggerPostMoveFlash(entry.element);

  //     if (trigger !== "keyboard") {
  //       return;
  //     }

  //     liveRegion.announce(
  //       `You've moved ${item} from position ${startIndex + 1} to position ${
  //         finishIndex + 1
  //       } of ${column.items.length} in the ${column.Name} column.`
  //     );

  //     return;
  //   }

  //   if (outcome.type === "card-move") {
  //     const {
  //       finishColumnId,
  //       itemIndexInStartColumn,
  //       itemIndexInFinishColumn,
  //     } = outcome;

  //     //   const data = data;
  //     const destinationColumn = dndColumnMap[finishColumnId];
  //     const item = destinationColumn.items[itemIndexInFinishColumn];

  //     const finishPosition =
  //       typeof itemIndexInFinishColumn === "number"
  //         ? itemIndexInFinishColumn + 1
  //         : destinationColumn.items.length;

  //     const entry = registry.getCard(item);
  //     if (!entry) {
  //       return;
  //     }
  //     triggerPostMoveFlash(entry.element);

  //     if (trigger !== "keyboard") {
  //       return;
  //     }

  //     liveRegion.announce(
  //       `You've moved ${item} from position ${
  //         itemIndexInStartColumn + 1
  //       } to position ${finishPosition} in the ${
  //         destinationColumn.Name
  //       } column.`
  //     );

  //     return;
  //   }
  // }, [lastOperation, registry, dndColumnMap, orderedColumnIds]);

  useEffect(() => {
    return liveRegion.cleanup();
  }, []);

  const getColumns = useCallback(() => {
    return orderedColumnIds.map((columnId) => dndColumnMap[columnId]);
  }, [dndColumnMap, orderedColumnIds]);

  const reorderColumn = useCallback(
    ({
      startIndex,
      finishIndex,
    }: // trigger = "keyboard",
    {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      // const outcome: Outcome = {
      //   type: "column-reorder",
      //   columnId: orderedColumnIds[startIndex],
      //   startIndex,
      //   finishIndex,
      // };

      const newOrderedColumnIds = reorder({
        list: orderedColumnIds,
        startIndex,
        finishIndex,
      });

      onReorderColumn(newOrderedColumnIds);
    },
    [onReorderColumn, orderedColumnIds]
  );

  const reorderCard = useCallback(
    ({
      columnId,
      startIndex,
      finishIndex,
    }: // trigger = "keyboard",
    {
      columnId: number;
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      const sourceColumn = dndColumnMap[columnId];
      const updatedItems = reorder({
        list: sourceColumn.items,
        startIndex,
        finishIndex,
      });

      const orderedTaskIds = updatedItems;
      onReorderTask(columnId, orderedTaskIds);

      // const outcome: Outcome | null = {
      //   type: "card-reorder",
      //   columnId,
      //   startIndex,
      //   finishIndex,
      // };
    },
    [dndColumnMap, onReorderTask]
  );

  const moveCard = useCallback(
    ({
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
    }: // trigger = "keyboard",
    {
      startColumnId: number;
      finishColumnId: number;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn?: number;
      trigger?: "pointer" | "keyboard";
    }) => {
      // invalid cross column movement
      if (startColumnId === finishColumnId) {
        return;
      }
      const sourceColumn = dndColumnMap[startColumnId];
      const destinationColumn = dndColumnMap[finishColumnId];
      const itemId = sourceColumn.items[itemIndexInStartColumn];

      const destinationItems = Array.from(destinationColumn.items);
      // Going into the first position if no index is provided
      const newIndexInDestination = itemIndexInFinishColumn ?? 0;
      destinationItems.splice(newIndexInDestination, 0, itemId);

      const sourceColumnNewOrderedItems = sourceColumn.items.filter(
        (i) => i !== itemId
      );

      onMoveCard(itemId, finishColumnId, {
        [startColumnId]: sourceColumnNewOrderedItems,
        [finishColumnId]: destinationItems,
      });

      // const outcome: Outcome | null = {
      //   type: "card-move",
      //   finishColumnId,
      //   itemIndexInStartColumn,
      //   itemIndexInFinishColumn: newIndexInDestination,
      // };
    },
    [onMoveCard, dndColumnMap]
  );

  const [instanceId] = useState(() => Symbol("instance-id"));

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }
          // need to handle drop

          // 1. remove element from original position
          // 2. move to new position

          if (source.data.type === "column") {
            const startIndex: number = orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId
            );

            const target = location.current.dropTargets[0];
            const indexOfTarget: number = orderedColumnIds.findIndex(
              (id) => id === target.data.columnId
            );
            const closestEdgeOfTarget: Edge | null = extractClosestEdge(
              target.data
            );

            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "horizontal",
            });

            reorderColumn({ startIndex, finishIndex, trigger: "pointer" });
          }
          // Dragging a card
          if (source.data.type === "card") {
            const itemId = source.data.itemId;
            invariant(typeof itemId === "number");
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === "number");
            const sourceColumn = dndColumnMap[Number(sourceId)];
            const itemIndex = sourceColumn.items.findIndex(
              (item) => item === itemId
            );

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === "number");
              const destinationColumn = dndColumnMap[Number(destinationId)];
              invariant(destinationColumn);

              // reordering in same column
              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget: sourceColumn.items.length - 1,
                  closestEdgeOfTarget: null,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.Id,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }

              // moving to a new column
              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.Id,
                finishColumnId: destinationColumn.Id,
                trigger: "pointer",
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === "number");
              const destinationColumn =
                dndColumnMap[Number(destinationColumnId)];

              const indexOfTarget = destinationColumn.items.findIndex(
                (item) => item === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                destinationCardRecord.data
              );

              // case 1: ordering in the same column
              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget,
                  closestEdgeOfTarget,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.Id,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }

              // case 2: moving into a new column relative to a card

              const destinationIndex =
                closestEdgeOfTarget === "bottom"
                  ? indexOfTarget + 1
                  : indexOfTarget;

              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.Id,
                finishColumnId: destinationColumn.Id,
                itemIndexInFinishColumn: destinationIndex,
                trigger: "pointer",
              });
            }
          }
        },
      })
    );
  }, [
    instanceId,
    moveCard,
    reorderCard,
    reorderColumn,
    dndColumnMap,
    orderedColumnIds,
  ]);

  const contextValue: BoardContextValue = useMemo(() => {
    return {
      getColumns,
      reorderColumn,
      reorderCard,
      moveCard,
      registerCard: registry.registerCard,
      registerColumn: registry.registerColumn,
      instanceId,
    };
  }, [getColumns, reorderColumn, reorderCard, registry, moveCard, instanceId]);

  return (
    <BoardContext.Provider value={contextValue}>
      <Board>
        {orderedColumnIds
          .filter((columnId) => dndColumnMap[columnId])
          .map((columnId) => {
            return (
              <Column
                column={dndColumnMap[columnId]}
                key={columnId}
                renderColumnHeader={renderColumnHeader}
                renderCardItem={renderCard}
                renderNewCardItem={() =>
                  renderNewCardItem(dndColumnMap[columnId])
                }
              />
            );
          })}
        {renderNewColumnItem()}
      </Board>
    </BoardContext.Provider>
  );
};
