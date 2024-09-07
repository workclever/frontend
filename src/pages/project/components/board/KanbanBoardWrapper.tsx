import React from "react";
import { AddNewColumnInput } from "./AddNewColumnInput";
import { AddNewTaskInput } from "./AddNewTaskInput";
import { ColumnNameRenderer } from "./ColumnNameRenderer";
import { DndKanbanBoard } from "./dnd/kanban/DndKanbanBoard";
import { Task } from "./Task";
import { TaskCardKanban } from "./TaskCardKanban";
import { useKanbanBoardData } from "./hooks/useKanbanBoardData";
import {
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
} from "@app/services/api";

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

  const onMoveCard = (grouped: { [columnId: number]: number[] }) => {
    updateTaskOrders({
      GroupedTasks: grouped,
    });
  };

  return (
    <DndKanbanBoard
      dndColumnMap={dndKanbanItems.dndColumnMap}
      orderedColumnIds={dndKanbanItems.orderedColumnIds}
      onReorderColumn={onReorderColumn}
      onReorderTask={onReorderTask}
      onMoveCard={onMoveCard}
      renderColumnHeader={(column) => <ColumnNameRenderer column={column} />}
      renderCard={(task) => (
        <Task
          task={task}
          findSubtasks={findSubtasks}
          customFields={customFieldsVisibleOnCard}
          onTaskClick={() => onTaskSelect(task)}
        >
          <TaskCardKanban
            task={task}
            findSubtasks={findSubtasks}
            customFields={customFieldsVisibleOnCard}
          />
        </Task>
      )}
      renderNewColumnItem={() => <AddNewColumnInput />}
      renderNewCardItem={(column) => <AddNewTaskInput column={column} />}
    />
  );
};
