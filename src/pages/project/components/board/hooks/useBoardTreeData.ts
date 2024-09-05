import { useMemo } from "react";
import { TreeItem } from "../dnd/tree/types";
import { useColumns } from "@app/hooks/useColumns";
import { useProjectTasks } from "@app/hooks/useProjectTasks";
import { selectSelectedBoardId } from "@app/slices/project/projectSlice";
import { useSelector } from "react-redux";
import { TaskType } from "@app/types/Project";

export const useBoardTreeData = () => {
  const tasks = useProjectTasks();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { columns } = useColumns(Number(selectedBoardId));

  const tasksInBoard = Object.values(tasks).filter(
    (r) => r.BoardId === selectedBoardId
  );

  const dndTreeItems: TreeItem[] = useMemo(() => {
    // Create a map to store tasks by their ParentTaskItemId
    const tasksByParent: { [key: number]: TaskType[] } = {};
    tasksInBoard.forEach((task) => {
      const parentId = task.ParentTaskItemId ?? 0; // Use 0 for top-level tasks
      if (!tasksByParent[parentId]) {
        tasksByParent[parentId] = [];
      }
      tasksByParent[parentId].push(task);
    });

    // Sort tasks in each group by their Order
    Object.keys(tasksByParent).forEach((parentId) => {
      tasksByParent[Number(parentId)].sort((a, b) => a.Order - b.Order);
    });

    // Function to recursively build the tree structure
    const buildTaskTree = (parentId: number): TreeItem[] => {
      const children = tasksByParent[parentId] || [];
      return children.map((task) => ({
        id: `task-${task.Id}`,
        children: buildTaskTree(task.Id),
        isOpen: false, // You can set this based on your requirements
        data: task,
      }));
    };

    // Build the main tree structure
    return columns.map((column) => ({
      id: `column-${column.Id}`,
      children: buildTaskTree(0).filter(
        (task) => (task.data as TaskType).ColumnId === column.Id
      ),
      isOpen: true, // Assuming columns are always open
      data: column,
    }));
  }, [columns, tasksInBoard]);

  return { dndTreeItems, tasksInBoard };
};
