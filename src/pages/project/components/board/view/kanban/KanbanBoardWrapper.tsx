import React from "react";
import { AddNewColumnInput } from "../../AddNewColumnInput";
import { AddNewTaskInput } from "../../AddNewTaskInput";
import { DndKanbanBoard, GroupItem, MoveEdge } from "@ozgurrgul/dragulax";
import { KanbanBoardItem } from "./KanbanBoardItem";
import { useKanbanBoardData } from "./useKanbanBoardData";
import { useUpdateTaskPropertyMutation } from "@app/services/api";
import { TaskMenu } from "../../TaskMenu";
import { KanbanBoardColumnName } from "./KanbanBoardColumnName";
import { TaskType } from "@app/types/Project";

const getNewOrderByDestinationIndex = (
  destinationCards: GroupItem["cards"],
  destinationIndex: number,
  draggedCardId: number // Pass the ID of the dragged card
): number => {
  // Exclude the dragged card from the list
  const filteredCards = destinationCards.filter(
    (card) => card.id !== draggedCardId
  );

  if (filteredCards.length === 0) {
    return 100000; // Initial order value when the destination is empty
  }

  if (destinationIndex === 0) {
    // Place the new card before the first card
    const firstOrder = (filteredCards[0].data as TaskType).Order;
    return firstOrder / 2; // Position it between 0 and the first order
  }

  if (destinationIndex >= filteredCards.length) {
    // Place the new card after the last card
    const lastOrder = (filteredCards[filteredCards.length - 1].data as TaskType)
      .Order;
    return lastOrder + 100000; // Keep enough gap for future additions
  }

  // Get the previous and next orders from the filtered list
  const prevOrder = (filteredCards[destinationIndex - 1].data as TaskType)
    .Order;
  const nextOrder = (filteredCards[destinationIndex].data as TaskType).Order;

  // Check if the dragged item is being moved below its original position
  if (prevOrder === nextOrder) {
    // Handle edge case where dragged card was next to its original position
    return nextOrder + 100000;
  }

  // Calculate the new order by averaging the two adjacent orders
  return (prevOrder + nextOrder) / 2;
};

export const KanbanBoardWrapper: React.FC<{
  projectId: number;
  boardId: number;
}> = ({ projectId }) => {
  const {
    dndData: groupMap,
    customFieldsVisibleOnCard,
    findSubtasks,
    onTaskSelect,
    findTask,
    groupBy,
  } = useKanbanBoardData(projectId);

  const [updateTaskProperty] = useUpdateTaskPropertyMutation();

  const onMoveCard = (
    itemId: number,
    destinationGroupId: number,
    destinationIndex: number,
    edge: MoveEdge | null
  ) => {
    const task = findTask(itemId);
    if (!task) return;

    const destinationGroup = groupMap[destinationGroupId];
    if (!destinationGroup) return;

    console.log("drop", {
      itemId,
      destinationGroupId,
      destinationGroup,
      destinationIndex,
      edge,
    });

    const newOrder = getNewOrderByDestinationIndex(
      destinationGroup.cards,
      destinationIndex,
      itemId
    );

    console.log({ newOrder });

    // Putting at the top
    if (groupBy === "ColumnId") {
      updateTaskProperty({
        Task: task,
        Params: [
          {
            property: "ColumnId",
            value: destinationGroupId.toString(),
          },
          {
            property: "Order",
            value: newOrder.toString(),
          },
        ],
      });
    }

    return;
  };

  return (
    <DndKanbanBoard
      groupMap={groupMap}
      groupGap={8}
      groupWidth={250}
      groupStyle={{
        backgroundColor: "#fafafa",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
        position: "relative",
      }}
      renderGroupHeader={(group, groupId) => (
        <div>
          <KanbanBoardColumnName columnId={groupId} />
        </div>
      )}
      renderCard={(cardId) => {
        const task = findTask(cardId);
        if (!task) return null;
        return (
          <div>
            <TaskMenu
              task={task}
              triggers={["contextMenu"]}
              menuKeys={[
                "view",
                "quick-view",
                "edit-title",
                "copy-link",
                "send-to-top",
                "send-to-bottom",
                "delete",
              ]}
            >
              {/* <div> needed to pass mouse events from dropdown */}
              <div onClick={() => onTaskSelect(task)}>
                <KanbanBoardItem
                  task={task}
                  findSubtasks={findSubtasks}
                  customFields={customFieldsVisibleOnCard}
                />
              </div>
            </TaskMenu>
          </div>
        );
      }}
      renderNewGroupItem={() => (
        <div style={{ marginTop: 8 }}>
          <AddNewColumnInput />
        </div>
      )}
      renderNewCardItem={(columnId) => {
        return (
          <div>
            <AddNewTaskInput columnId={columnId} />
          </div>
        );
      }}
      onMoveCard={onMoveCard}
    />
  );
};
