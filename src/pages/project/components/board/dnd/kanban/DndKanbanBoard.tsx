import React, { useCallback, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { ColumnMap, DndColumnType } from "./types";
import { ColumnType, TaskType } from "@app/types/Project";
import { createRegistry } from "./registry";
import { BoardContext, BoardContextValue } from "./board-context";
import Board from "./Board";
import { Column } from "./Column";

type Outcome =
  | {
      type: "column-reorder";
      columnId: number;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-reorder";
      columnId: number;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: "card-move";
      finishColumnId: number;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn: number;
    };

type Trigger = "pointer" | "keyboard";

type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: number[];
  lastOperation: Operation | null;
};

export const DndKanbanBoard: React.FC<{
  dndColumnMap: ColumnMap;
  orderedColumnIds: number[];
  onReorderColumn: (orderedColumnIds: number[]) => void;
  onReorderTask: (columnId: number, orderedTaskIds: number[]) => void;
  onMoveCard: (grouped: { [columnId: number]: number[] }) => void;
  renderColumnHeader: (column: ColumnType) => React.ReactNode;
  renderCard: (task: TaskType) => React.ReactNode;
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
  const [data, setData] = useState<BoardState>({
    columnMap: dndColumnMap,
    orderedColumnIds,
    lastOperation: null,
  });

  const [registry] = useState(createRegistry);
  const { lastOperation } = data;

  useEffect(() => {
    if (lastOperation === null) {
      return;
    }
    const { outcome, trigger } = lastOperation;

    if (outcome.type === "column-reorder") {
      const { startIndex, finishIndex } = outcome;

      const { columnMap, orderedColumnIds } = data;
      const sourceColumn = columnMap[orderedColumnIds[finishIndex]];

      const entry = registry.getColumn(sourceColumn.Id);
      triggerPostMoveFlash(entry.element);

      liveRegion.announce(
        `You've moved ${sourceColumn.Name} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${orderedColumnIds.length}.`
      );

      return;
    }

    if (outcome.type === "card-reorder") {
      const { columnId, startIndex, finishIndex } = outcome;

      const { columnMap } = data;
      const column = columnMap[columnId];
      const item = column.items[finishIndex];

      const entry = registry.getCard(item.Id);
      triggerPostMoveFlash(entry.element);

      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.Title} from position ${
          startIndex + 1
        } to position ${finishIndex + 1} of ${column.items.length} in the ${
          column.Name
        } column.`
      );

      return;
    }

    if (outcome.type === "card-move") {
      const {
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn,
      } = outcome;

      //   const data = data;
      const destinationColumn = data.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      const finishPosition =
        typeof itemIndexInFinishColumn === "number"
          ? itemIndexInFinishColumn + 1
          : destinationColumn.items.length;

      const entry = registry.getCard(item.Id);
      triggerPostMoveFlash(entry.element);

      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.Title} from position ${
          itemIndexInStartColumn + 1
        } to position ${finishPosition} in the ${
          destinationColumn.Name
        } column.`
      );

      return;
    }
  }, [lastOperation, registry, data]);

  useEffect(() => {
    return liveRegion.cleanup();
  }, []);

  const getColumns = useCallback(() => {
    const { columnMap, orderedColumnIds } = data;
    return orderedColumnIds.map((columnId) => columnMap[columnId]);
  }, [data]);

  const reorderColumn = useCallback(
    ({
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const outcome: Outcome = {
          type: "column-reorder",
          columnId: data.orderedColumnIds[startIndex],
          startIndex,
          finishIndex,
        };

        const orderedColumnIds = reorder({
          list: data.orderedColumnIds,
          startIndex,
          finishIndex,
        });

        onReorderColumn(orderedColumnIds);

        return {
          ...data,
          orderedColumnIds,
          lastOperation: {
            outcome,
            trigger: trigger,
          },
        };
      });
    },
    [onReorderColumn]
  );

  const reorderCard = useCallback(
    ({
      columnId,
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      columnId: number;
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const sourceColumn = data.columnMap[columnId];
        const updatedItems = reorder({
          list: sourceColumn.items,
          startIndex,
          finishIndex,
        });

        const updatedSourceColumn: DndColumnType = {
          ...sourceColumn,
          items: updatedItems,
        };

        const orderedTaskIds = updatedItems.map((r) => r.Id);

        const updatedMap: ColumnMap = {
          ...data.columnMap,
          [columnId]: updatedSourceColumn,
        };

        onReorderTask(columnId, orderedTaskIds);

        const outcome: Outcome | null = {
          type: "card-reorder",
          columnId,
          startIndex,
          finishIndex,
        };

        return {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            trigger: trigger,
            outcome,
          },
        };
      });
    },
    [setData]
  );

  const moveCard = useCallback(
    ({
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger = "keyboard",
    }: {
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
      setData((data) => {
        const sourceColumn = data.columnMap[startColumnId];
        const destinationColumn = data.columnMap[finishColumnId];
        const item: TaskType = sourceColumn.items[itemIndexInStartColumn];

        const destinationItems = Array.from(destinationColumn.items);
        // Going into the first position if no index is provided
        // TODO last
        const newIndexInDestination = itemIndexInFinishColumn ?? 0;
        destinationItems.splice(newIndexInDestination, 0, item);

        const sourceColumnNewOrderedItems = sourceColumn.items.filter(
          (i) => i.Id !== item.Id
        );

        const updatedMap = {
          ...data.columnMap,
          [startColumnId]: {
            ...sourceColumn,
            items: sourceColumnNewOrderedItems,
          },
          [finishColumnId]: {
            ...destinationColumn,
            items: destinationItems,
          },
        };

        onMoveCard({
          [startColumnId]: sourceColumnNewOrderedItems.map((r) => r.Id),
          [finishColumnId]: destinationItems.map((r) => r.Id),
        });

        const outcome: Outcome | null = {
          type: "card-move",
          finishColumnId,
          itemIndexInStartColumn,
          itemIndexInFinishColumn: newIndexInDestination,
        };

        return {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            outcome,
            trigger: trigger,
          },
        };
      });
    },
    [setData, onMoveCard]
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
            const startIndex: number = data.orderedColumnIds.findIndex(
              (columnId) => columnId === source.data.columnId
            );

            const target = location.current.dropTargets[0];
            const indexOfTarget: number = data.orderedColumnIds.findIndex(
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
            // TODO: these lines not needed if item has columnId on it
            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === "number");
            const sourceColumn = data.columnMap[Number(sourceId)];
            const itemIndex = sourceColumn.items.findIndex(
              (item) => item.Id === Number(itemId)
            );

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === "number");
              const destinationColumn = data.columnMap[Number(destinationId)];
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
                data.columnMap[Number(destinationColumnId)];

              const indexOfTarget = destinationColumn.items.findIndex(
                (item) => item.Id === destinationCardRecord.data.itemId
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
  }, [data, instanceId, moveCard, reorderCard, reorderColumn]);

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
        {data.orderedColumnIds
          .filter((columnId) => data.columnMap[columnId])
          .map((columnId) => {
            return (
              <Column
                column={data.columnMap[columnId]}
                key={columnId}
                renderColumnHeader={renderColumnHeader}
                renderCardItem={renderCard}
                renderNewCardItem={() =>
                  renderNewCardItem(data.columnMap[columnId])
                }
              />
            );
          })}
        {renderNewColumnItem()}
      </Board>
    </BoardContext.Provider>
  );
};
