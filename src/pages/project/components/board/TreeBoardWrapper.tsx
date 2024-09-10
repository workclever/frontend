import { AddNewColumnInput } from "./AddNewColumnInput";
import { AddNewTaskInput } from "./AddNewTaskInput";
import { ColumnNameRenderer } from "./ColumnNameRenderer";
import { DndTreeBoard } from "./dnd/tree/DndTreeBoard";
import { TaskCardTree } from "./TaskCardTree";
import { useTreeBoardData } from "./hooks/useTreeBoardData";
import {
  useUpdateTaskOrdersMutation,
  useUpdateTaskPropertyMutation,
  useMoveTaskToColumnMutation,
} from "@app/services/api";
import { reorderArray } from "./utils/orderUtils";
import { type Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";
import { useDispatch } from "react-redux";
import { toggleExpandedTreeItem } from "@app/slices/board/boardSlice";
import { TaskMenu } from "./TaskMenu";

export const TreeBoardWrapper: React.FC<{ projectId: number }> = ({
  projectId,
}) => {
  const dispatch = useDispatch();
  const {
    dndData: dndTreeItems,
    tasksInBoard,
    customFieldsVisibleOnCard,
    isTasksLoading,
    onTaskSelect,
  } = useTreeBoardData(Number(projectId));

  const [updateTaskOrders] = useUpdateTaskOrdersMutation();
  const [updateTaskProperty] = useUpdateTaskPropertyMutation();
  const [moveTask] = useMoveTaskToColumnMutation();

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
    // TODO implement
    console.log("onMakeChildInColumn", { taskId, columnIn });
  };

  if (isTasksLoading) {
    return <LoadingSpin />;
  }

  return (
    <DndTreeBoard
      items={dndTreeItems}
      toggleOpen={(item) => dispatch(toggleExpandedTreeItem(item.id))}
      renderItem={(item) => {
        if ("ColumnId" in item.data) {
          return (
            <TaskMenu
              task={item.data}
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
              <div
                style={{ width: "100%" }}
                onClick={() => {
                  if ("ColumnId" in item.data) {
                    onTaskSelect(item.data);
                  }
                }}
              >
                <TaskCardTree
                  treeItem={item}
                  task={item.data}
                  customFields={customFieldsVisibleOnCard}
                  toggleOpen={() => dispatch(toggleExpandedTreeItem(item.id))}
                />
              </div>
            </TaskMenu>
          );
        }
        return (
          <>
            <ColumnNameRenderer
              column={item.data}
              toggleOpen={() => dispatch(toggleExpandedTreeItem(item.id))}
            />
          </>
        );
      }}
      onMoveItem={onMoveItem}
      onReorderItem={onReorderItem}
      onMakeChildInTask={onMakeChildInTask}
      onMakeChildInColumn={onMakeChildInColumn}
      renderNewColumnItem={() => (
        <div style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
          <AddNewColumnInput />
        </div>
      )}
      renderNewCardItem={(column) => (
        <div style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
          <AddNewTaskInput column={column} />
        </div>
      )}
    />
  );
};
