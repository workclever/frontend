import React from "react";
import { AddNewColumnInput } from "./AddNewColumnInput";
import { AddNewTaskInput } from "./AddNewTaskInput";
import { ColumnNameRenderer } from "./ColumnNameRenderer";
import { DndKanbanBoard } from "./dnd/kanban/DndKanbanBoard";
import { TaskCardKanban } from "./TaskCardKanban";
import { useKanbanBoardData } from "./hooks/useKanbanBoardData";
import {
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
  useUpdateTaskPropertyMutation,
} from "@app/services/api";
import { TaskType } from "@app/types/Project";
import { TaskMenu } from "./TaskMenu";

export const KanbanBoardWrapper: React.FC<{
  projectId: number;
  boardId: number;
}> = ({ projectId, boardId }) => {
  const {
    dndData: dndKanbanItems,
    findSubtasks,
    onTaskSelect,
    customFieldsVisibleOnCard,
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

  const onReorderTask = (columnId: number, orderedColumnIds: number[]) => {
    updateTaskOrders({
      GroupedTasks: {
        [columnId]: orderedColumnIds,
      },
    });
  };

  const onMoveCard = (
    task: TaskType,
    finishColumnId: number,
    grouped: { [columnId: number]: number[] }
  ) => {
    updateTaskProperty({
      Task: task,
      Params: {
        property: "ColumnId",
        value: finishColumnId.toString(),
      },
    })
      .unwrap()
      .then(() => {
        updateTaskOrders({
          GroupedTasks: grouped,
        });
      });
  };

  return (
    <DndKanbanBoard
      // TODO workaround
      key={JSON.stringify(dndKanbanItems.dndColumnMap)}
      dndColumnMap={dndKanbanItems.dndColumnMap}
      orderedColumnIds={dndKanbanItems.orderedColumnIds}
      onReorderColumn={onReorderColumn}
      onReorderTask={onReorderTask}
      onMoveCard={onMoveCard}
      renderColumnHeader={(column) => <ColumnNameRenderer column={column} />}
      renderCard={(task) => (
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
      )}
      renderNewColumnItem={() => (
        <div style={{ marginTop: 8 }}>
          <AddNewColumnInput />
        </div>
      )}
      renderNewCardItem={(column) => <AddNewTaskInput column={column} />}
    />
  );
};
