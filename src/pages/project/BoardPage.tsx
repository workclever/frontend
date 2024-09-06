import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import {
  selectBoardViewType,
  setSelectedProjectId,
  setSelectedBoardId,
} from "../../slices/project/projectSlice";
import { useParams } from "react-router-dom";
import React from "react";
import { BoardLayout } from "./components/board/BoardLayout";
import { DndKanbanBoard } from "./components/board/dnd/kanban/DndKanbanBoard";
import { useBoardData } from "@app/hooks/useBoardData";
import {
  useListCustomFieldsQuery,
  useMoveTaskToColumnMutation,
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
  useUpdateTaskPropertyMutation,
} from "@app/services/api";
import { ColumnNameRenderer } from "./components/board/ColumnNameRenderer";
import { Task } from "./components/board/Task";
import { AddNewTaskInput } from "./components/board/AddNewTaskInput";
import { AddNewColumnInput } from "./components/board/AddNewColumnInput";
import { DndTreeBoard } from "./components/board/dnd/tree/DndTreeBoard";
import { useBoardTreeData } from "./components/board/hooks/useBoardTreeData";
import { type Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { TaskCardKanban } from "./components/board/TaskCardKanban";
import { TaskCardTree } from "./components/board/TaskCardTree";
import { TaskType } from "@app/types/Project";
import { useBoardKanbanData } from "./components/board/hooks/useBoardKanbanData";
import { reorderArray } from "./components/board/utils/orderUtils";

export const BoardPage = () => {
  const dispatch = useDispatch();
  const { projectId, boardId } = useParams();
  const boardViewType = useSelector(selectBoardViewType);
  const { findSubtasks, onTaskSelect } = useBoardData(Number(projectId));
  const { data: customFields } = useListCustomFieldsQuery(Number(projectId), {
    skip: !projectId,
  });
  const customFieldsVisibleOnCard = (customFields?.Data || []).filter(
    (r) => r.ShowInTaskCard && r.Enabled
  );
  const { dndData: dndKanbanItems } = useBoardKanbanData(Number(projectId));
  const { dndData: dndTreeItems, tasksInBoard } = useBoardTreeData(
    Number(projectId)
  );
  const [updateColumnOrders] = useUpdateColumnOrdersMutation();
  const [updateTaskOrders] = useUpdateTaskOrdersMutation();
  const [updateTaskProperty] = useUpdateTaskPropertyMutation();
  const [moveTask] = useMoveTaskToColumnMutation();

  React.useEffect(() => {
    if (projectId) {
      dispatch(setSelectedProjectId(Number(projectId)));
    }
  }, [dispatch, projectId]);

  React.useEffect(() => {
    if (boardId) {
      dispatch(setSelectedBoardId(Number(boardId)));
    }
  }, [dispatch, boardId]);

  const onReorderColumn = (orderedColumnIds: number[]) => {
    updateColumnOrders({
      BoardId: Number(boardId),
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

  const onMoveItem = (taskId: number, newColumnId: number) => {
    const task = tasksInBoard.find((r) => r.Id === taskId);
    if (!task || task.ColumnId === newColumnId) {
      return;
    }
    const newSiblings = tasksInBoard.filter((r) => r.ColumnId === newColumnId);
    updateTaskOrders({
      GroupedTasks: {
        [newColumnId]: newSiblings.map((r) => r.Id).concat(taskId),
      },
    });
  };

  const onReorderItem = (
    taskId: number,
    targetTaskId: number,
    position: Instruction["type"]
  ) => {
    if (taskId === targetTaskId) return;
    const task = tasksInBoard.find((r) => r.Id === taskId);
    const targetTask = tasksInBoard.find((r) => r.Id === targetTaskId);

    if (!task || !targetTask) {
      return;
    }

    const isInSameColumn = task.ColumnId === targetTask.ColumnId;
    // Order in same column
    if (isInSameColumn) {
      const columnSiblings = tasksInBoard
        .filter((r) => r.ColumnId === task.ColumnId)
        .filter((r) => !r.ParentTaskItemId)
        .slice()
        .sort((a, b) => a.Order - b.Order)
        .map((r) => r.Id);
      const orderedColumnIds = reorderArray(
        columnSiblings,
        task.Id,
        targetTask.Id,
        position
      );

      // If the task has same parent as the target, we only update order
      if (
        Number(task.ParentTaskItemId) === Number(targetTask.ParentTaskItemId)
      ) {
        updateTaskOrders({
          GroupedTasks: {
            [task.ColumnId]: orderedColumnIds,
          },
        });
      } else {
        // First set parent to new one or remove it
        updateTaskProperty({
          Task: task,
          Params: {
            property: "ParentTaskItemId",
            value: targetTask.ParentTaskItemId?.toString() ?? null,
          },
        })
          .unwrap()
          .then(() => {
            updateTaskOrders({
              GroupedTasks: {
                [task.ColumnId]: orderedColumnIds,
              },
            });
          });
      }
    } else {
      // if target has parent
      if (targetTask.ParentTaskItemId) {
        const parentSiblings = tasksInBoard
          .filter((r) => r.ColumnId === targetTask.ColumnId)
          .filter(
            (r) =>
              r.ParentTaskItemId &&
              r.ParentTaskItemId === Number(targetTask.ParentTaskItemId)
          )
          .slice()
          .sort((a, b) => a.Order - b.Order)
          .map((r) => r.Id);

        const orderedColumnIds = reorderArray(
          parentSiblings,
          task.Id,
          targetTask.Id,
          position
        );
        updateTaskProperty({
          Task: task,
          Params: {
            property: "ParentTaskItemId",
            value: targetTask.ParentTaskItemId.toString(),
          },
        })
          .unwrap()
          .then(() => {
            updateTaskOrders({
              GroupedTasks: {
                [targetTask.ColumnId]: orderedColumnIds,
              },
            });
          });
      } else {
        const columnSiblings = tasksInBoard
          .filter((r) => r.ColumnId === targetTask.ColumnId)
          .filter((r) => !r.ParentTaskItemId)
          .slice()
          .sort((a, b) => a.Order - b.Order)
          .map((r) => r.Id);

        const orderedColumnIds = reorderArray(
          columnSiblings,
          task.Id,
          targetTask.Id,
          position
        );

        updateTaskProperty({
          Task: task,
          Params: {
            property: "ParentTaskItemId",
            value: targetTask.ParentTaskItemId?.toString() ?? null,
          },
        })
          .unwrap()
          .then(() => {
            updateTaskOrders({
              GroupedTasks: {
                [targetTask.ColumnId]: orderedColumnIds,
              },
            });
          });
      }
    }
  };

  const onMakeChildInTask = (taskId: number, targetTaskId: number) => {
    if (taskId === targetTaskId) return;

    const task = tasksInBoard.find((r) => r.Id === taskId);
    const targetTask = tasksInBoard.find((r) => r.Id === targetTaskId);

    if (!task || !targetTask) {
      return;
    }

    const isInSameColumn = task.ColumnId === targetTask.ColumnId;
    // Order in same column
    if (isInSameColumn) {
      updateTaskProperty({
        Task: task,
        Params: {
          property: "ParentTaskItemId",
          value: targetTaskId.toString(),
        },
      });
    } else {
      // First move the task to column
      moveTask({
        TargetBoardId: targetTask.BoardId,
        TargetColumnId: targetTask.ColumnId,
        Task: task,
      })
        .unwrap()
        .then(() => {
          updateTaskProperty({
            Task: task,
            Params: {
              property: "ParentTaskItemId",
              value: targetTaskId.toString(),
            },
          });
        });
    }
  };

  const onMakeChildInColumn = (taskId: number, columnIn: number) => {
    // TODO check later
    console.log("onMakeChildInColumn", { taskId, columnIn });
  };

  const renderBoard = () => {
    if (!boardId) {
      return null;
    }
    return (
      <BoardLayout mode="board">
        <div style={{ padding: 0 }}>
          {boardViewType === "kanban" && (
            <DndKanbanBoard
              // TODO workaround
              key={JSON.stringify(dndKanbanItems.dndColumnMap)}
              dndColumnMap={dndKanbanItems.dndColumnMap}
              orderedColumnIds={dndKanbanItems.orderedColumnIds}
              onReorderColumn={onReorderColumn}
              onReorderTask={onReorderTask}
              onMoveCard={onMoveCard}
              renderColumnHeader={(column) => (
                <ColumnNameRenderer column={column} />
              )}
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
              renderNewCardItem={(column) => (
                <AddNewTaskInput column={column} />
              )}
            />
          )}
          {boardViewType === "tree" && (
            <DndTreeBoard
              // TODO workaround
              key={JSON.stringify(dndTreeItems)}
              items={dndTreeItems}
              renderItem={(item, toggleOpen) => {
                if ("ColumnId" in item.data) {
                  return (
                    <Task
                      task={item.data}
                      findSubtasks={findSubtasks}
                      customFields={customFieldsVisibleOnCard}
                      onTaskClick={() => onTaskSelect(item.data as TaskType)}
                    >
                      <TaskCardTree
                        treeItem={item}
                        task={item.data}
                        customFields={customFieldsVisibleOnCard}
                        toggleOpen={toggleOpen}
                      />
                    </Task>
                  );
                }
                return (
                  <>
                    <ColumnNameRenderer
                      column={item.data}
                      toggleOpen={toggleOpen}
                    />
                  </>
                );
              }}
              onMoveItem={onMoveItem}
              onReorderItem={onReorderItem}
              onMakeChildInTask={onMakeChildInTask}
              onMakeChildInColumn={onMakeChildInColumn}
              renderNewColumnItem={() => (
                <div
                  style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}
                >
                  <AddNewColumnInput />
                </div>
              )}
              renderNewCardItem={(column) => (
                <div
                  style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}
                >
                  <AddNewTaskInput column={column} />
                </div>
              )}
            />
          )}
        </div>
      </BoardLayout>
    );
  };

  const newBoardTrigger = () => {
    return (
      <Empty>
        <>
          <Space direction="vertical">
            <span>
              There is no board in this project, create a board to be able to
              create tasks
            </span>
            <Button type="primary" size="large">
              Create Now
            </Button>
          </Space>
        </>
      </Empty>
    );
  };

  const renderContent = () => {
    if (boardId) {
      return renderBoard();
    }
    return newBoardTrigger();
  };

  return <>{renderContent()}</>;
};
