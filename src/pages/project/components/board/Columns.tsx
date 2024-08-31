import { Task } from "./Task";
import { ColumnType, TaskType } from "../../../../types/Project";
// @ts-ignore
import hash from "object-hash";
import React from "react";
import {
  useListCustomFieldsQuery,
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
} from "../../../../services/api";
import { useSelector } from "react-redux";
import {
  selectSelectedBoardId,
  selectSelectedProjectId,
} from "../../../../slices/project/projectSlice";
import { debounce } from "lodash";
import { Items, DndColumnContainers } from "../dnd/DndColumnContainers";
import { ColumnNameRenderer } from "./ColumnNameRenderer";
import { AddNewCardInput } from "./AddNewCardInput";
import { AddNewColumnInput } from "./AddNewColumnInput";
import { TaskDetail } from "./task-detail/TaskDetail";
import AtlastKitDrawer from "@atlaskit/drawer";
import { useBoardData } from "../../../../hooks/useBoardData";

const DndInsideContainers: React.FC<{
  vertical: boolean;
  findTask: (id: number) => TaskType;
  onTaskSelect: (task: TaskType) => void;
  findSubtasks: (id: number) => TaskType[];
  findColumn: any;
  dndItems: {
    [key: string]: string[];
  };
}> = ({
  vertical,
  findTask,
  onTaskSelect,
  findSubtasks,
  findColumn,
  dndItems,
}) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { data: customFields } = useListCustomFieldsQuery(
    Number(selectedProjectId),
    {
      skip: !selectedProjectId,
    }
  );

  const [updateColumnOrders] = useUpdateColumnOrdersMutation();
  const [updateTaskOrders] = useUpdateTaskOrdersMutation();

  const customFieldsVisibleOnCard = (customFields?.Data || []).filter(
    (r) => r.ShowInTaskCard && r.Enabled
  );
  const renderTaskItem = ({ itemId, listeners }: any) => {
    const task = findTask(Number(itemId));
    return (
      task && (
        <Task
          listeners={listeners}
          task={task}
          onTaskClick={() => onTaskSelect(task)}
          findSubtasks={findSubtasks}
          customFields={customFieldsVisibleOnCard}
        />
      )
    );
  };

  const onReorderItems = debounce((items: Items) => {
    const groupedTasks: { [columnId: number]: number[] } = {};
    for (const key in items) {
      const numberColumnId = parseInt(key.split("column:")[1]);
      if (!groupedTasks[numberColumnId]) {
        groupedTasks[numberColumnId] = [];
      }
      // Extract task ids
      groupedTasks[numberColumnId] = items[key].map((r) =>
        parseInt(r.split("-")[1])
      );
    }
    updateTaskOrders({ GroupedTasks: groupedTasks });
  }, 600);

  return (
    <DndColumnContainers
      renderNewContainerInput={() => <AddNewColumnInput />}
      vertical={vertical}
      renderContainer={(columnId, children, listeners) => {
        const column = findColumn(columnId) as ColumnType;
        const columnContainerStyle = {
          width: vertical ? "100%" : "280px",
          height: "100%",
          marginBottom: vertical ? 16 : 0,
          paddingRight: vertical ? 0 : 8,
        };

        const columnInnerStyle = {
          marginBottom: 4,
          // border: vertical ? `1px solid ${gray[0]}` : 'inherit'
        };

        return (
          <div style={columnContainerStyle}>
            <div style={columnInnerStyle}>
              <ColumnNameRenderer column={column} listeners={listeners} />
              <div>{children}</div>
            </div>
            <AddNewCardInput column={column} />
          </div>
        );
      }}
      dndItems={dndItems}
      renderItem={renderTaskItem}
      onColumnDrop={(columnIds) => {
        updateColumnOrders({
          BoardId: Number(selectedBoardId),
          ColumnIds: columnIds,
        });
      }}
      onReorderItems={onReorderItems}
    />
  );
};

export const Columns: React.FC = () => {
  const {
    dndItems,
    selectedTaskId,
    setSelectedTaskId,
    findColumn,
    findTask,
    findSubtasks,
    vertical,
    onTaskSelect,
    onTaskDelete,
  } = useBoardData();

  const renderTaskDetailDrawer = () => {
    if (!selectedTaskId) {
      return undefined;
    }

    const task = findTask(selectedTaskId);
    if (!task) {
      return null;
    }

    return (
      <AtlastKitDrawer
        isOpen
        onClose={() => setSelectedTaskId(undefined)}
        width="wide"
        enterFrom="left"
      >
        <TaskDetail
          task={task}
          onTaskSelect={onTaskSelect}
          findSubtasks={findSubtasks}
          onTaskDelete={onTaskDelete}
        />
      </AtlastKitDrawer>
    );
  };

  return (
    <div key={hash({ dndItems })}>
      <DndInsideContainers
        vertical={vertical}
        dndItems={dndItems}
        findColumn={findColumn}
        findSubtasks={findSubtasks}
        findTask={findTask}
        onTaskSelect={onTaskSelect}
      />
      {renderTaskDetailDrawer()}
    </div>
  );
};
