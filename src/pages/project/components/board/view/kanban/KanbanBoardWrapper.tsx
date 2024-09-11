import React from "react";
import { AddNewColumnInput } from "../../AddNewColumnInput";
import { AddNewTaskInput } from "../../AddNewTaskInput";
import { ColumnNameRenderer } from "../../ColumnNameRenderer";
import { DndKanbanBoard } from "@ozgurrgul/dragulax";
import { TaskCardKanban } from "./TaskCardKanban";
import { useKanbanBoardData } from "./useKanbanBoardData";
import {
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
  useUpdateTaskPropertyMutation,
} from "@app/services/api";
import { TaskMenu } from "../../TaskMenu";

export const KanbanBoardWrapper: React.FC<{
  projectId: number;
  boardId: number;
}> = ({ projectId, boardId }) => {
  const {
    dndData,
    customFieldsVisibleOnCard,
    findSubtasks,
    onTaskSelect,
    findTask,
  } = useKanbanBoardData(projectId);

  const [updateColumnOrders] = useUpdateColumnOrdersMutation();
  const [updateTaskOrders] = useUpdateTaskOrdersMutation();
  const [updateTaskProperty] = useUpdateTaskPropertyMutation();

  const onReorderColumn = (orderedColumnIds: number[]) => {
    updateColumnOrders({
      BoardId: boardId,
      ColumnIds: orderedColumnIds,
    });
  };

  const onReorderCardInColumn = (
    columnId: number,
    orderedColumnIds: number[]
  ) => {
    updateTaskOrders({
      GroupedTasks: {
        [columnId]: orderedColumnIds,
      },
    });
  };

  const onMoveCardToOtherColumn = (
    cardId: number,
    finishColumnId: number,
    newOrderedColumnIds: {
      start: {
        columnId: number;
        orderedCardIds: number[];
      };
      finish: {
        columnId: number;
        orderedCardIds: number[];
      };
    }
  ) => {
    updateTaskProperty({
      Task: findTask(cardId),
      Params: {
        property: "ColumnId",
        value: finishColumnId.toString(),
      },
    })
      .unwrap()
      .then(() => {
        updateTaskOrders({
          GroupedTasks: {
            [newOrderedColumnIds.start.columnId]:
              newOrderedColumnIds.start.orderedCardIds,
            [newOrderedColumnIds.finish.columnId]:
              newOrderedColumnIds.finish.orderedCardIds,
          },
        });
      });
  };

  return (
    <DndKanbanBoard
      dndColumnMap={dndData.dndColumnMap}
      orderedColumnIds={dndData.orderedColumnIds}
      columnGap={8}
      columnWidth={250}
      columnStyle={{
        backgroundColor: "#fafafa",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
        position: "relative",
      }}
      onReorderColumn={onReorderColumn}
      onReorderCardInColumn={onReorderCardInColumn}
      onMoveCardToOtherColumn={onMoveCardToOtherColumn}
      renderColumnHeader={(columnId) => (
        <div>
          <ColumnNameRenderer columnId={columnId} />
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
                <TaskCardKanban
                  task={task}
                  findSubtasks={findSubtasks}
                  customFields={customFieldsVisibleOnCard}
                />
              </div>
            </TaskMenu>
          </div>
        );
      }}
      renderNewColumnItem={() => (
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
    />
  );
};
