import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";
import {
  useUpdateTaskOrdersMutation,
  useUpdateTaskPropertyMutation,
  useMoveTaskToColumnMutation,
} from "@app/services/api";
import { toggleExpandedTreeItem } from "@app/slices/board/boardSlice";
import { TaskType } from "@app/types/Project";
import { ItemId, MovePosition, DndTreeBoard } from "@ozgurrgul/dragulax";
import { useDispatch } from "react-redux";
import { AddNewColumnInput } from "../../AddNewColumnInput";
import { AddNewTaskInput } from "../../AddNewTaskInput";
import { useTreeBoardData } from "./useTreeBoardData";
import { TaskMenu } from "../../TaskMenu";
import { reorderArray } from "../../utils/orderUtils";
import { TreeBoardItem } from "./TreeBoardItem";
import { TreeBoardColumnName } from "./TreeBoardColumnName";

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
    findTask,
  } = useTreeBoardData(Number(projectId));

  const [updateTaskOrders] = useUpdateTaskOrdersMutation();
  const [updateTaskProperty] = useUpdateTaskPropertyMutation();
  const [moveTask] = useMoveTaskToColumnMutation();

  // const onMoveItem = (taskId: number, newColumnId: number) => {
  //   const task = tasksInBoard.find((r) => r.Id === taskId);
  //   if (!task || task.ColumnId === newColumnId) {
  //     return;
  //   }
  //   const newSiblings = tasksInBoard.filter((r) => r.ColumnId === newColumnId);
  //   updateTaskOrders({
  //     GroupedTasks: {
  //       [newColumnId]: newSiblings.map((r) => r.Id).concat(taskId),
  //     },
  //   });
  // };

  const onReorderItem = (
    itemId: ItemId,
    targetId: ItemId,
    position: MovePosition
  ) => {
    if (itemId === targetId) return;
    const itemIdNumber = Number(itemId.split("-")[1]);
    const targetIdNumber = Number(targetId.split("-")[1]);
    const task = tasksInBoard.find((r) => r.Id === itemIdNumber);
    const targetTask = tasksInBoard.find((r) => r.Id === targetIdNumber);

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

  const onMakeChildInTask = (itemId: ItemId, targetId: ItemId) => {
    if (itemId === targetId) return;

    const itemIdNumber = Number(itemId.split("-")[1]);
    const targetIdNumber = Number(targetId.split("-")[1]);

    const task = tasksInBoard.find((r) => r.Id === itemIdNumber);
    const targetTask = tasksInBoard.find((r) => r.Id === targetIdNumber);

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
          value: targetIdNumber.toString(),
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
              value: targetIdNumber.toString(),
            },
          });
        });
    }
  };

  // TODO when dragging an item to in between 2 items, we call onReorder item. make use of that and remove onMakeChildInColumn?
  const onMakeChildInColumn = (itemId: ItemId, targetGroupId: ItemId) => {
    // TODO implement
    const itemIdNumber = Number(itemId.split("-")[1]);
    const targetGroupIdNumber = Number(targetGroupId.split("-")[1]);

    const task = tasksInBoard.find((r) => r.Id === itemIdNumber);
    if (!task) return;

    const isInSameColumn = task.ColumnId === targetGroupIdNumber;
    if (isInSameColumn) return;

    console.log("onMakeChildInColumn", { itemId, targetGroupId });

    updateTaskProperty({
      Task: task,
      Params: {
        property: "ColumnId",
        value: targetGroupIdNumber.toString(),
      },
    });
  };

  if (isTasksLoading) {
    return <LoadingSpin />;
  }

  return (
    <DndTreeBoard
      items={dndTreeItems}
      toggleOpen={(item) => dispatch(toggleExpandedTreeItem(item.id))}
      renderItem={(item) => {
        const id = Number(item.id.split("-")[1]);
        if (item.id.startsWith("item-")) {
          const task = findTask(id) as TaskType;
          return (
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
              <div
                style={{ width: "100%" }}
                onClick={() => {
                  onTaskSelect(task);
                }}
              >
                <TreeBoardItem
                  treeItem={item}
                  task={task}
                  customFields={customFieldsVisibleOnCard}
                  toggleOpen={() => dispatch(toggleExpandedTreeItem(item.id))}
                />
              </div>
            </TaskMenu>
          );
        }
        return (
          <TreeBoardColumnName
            columnId={id}
            toggleOpen={() => dispatch(toggleExpandedTreeItem(item.id))}
          />
        );
      }}
      onReorderItem={onReorderItem}
      onMakeChildInItem={onMakeChildInTask}
      onMakeChildInGroup={onMakeChildInColumn}
      renderNewGroupItem={() => (
        <div style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
          <AddNewColumnInput />
        </div>
      )}
      renderNewItem={(parentGroupId) => (
        <div style={{ paddingLeft: 16, paddingTop: 8, paddingBottom: 8 }}>
          <AddNewTaskInput columnId={Number(parentGroupId.split("-")[1])} />
        </div>
      )}
    />
  );
};
