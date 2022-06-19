import { Typography } from "antd";
import { TaskType } from "../../../../../types/Project";
import React from "react";
import { debounce } from "lodash";
import { useTaskUpdateProperty } from "../../../../../hooks/useTaskUpdateProperty";
import { HttpResult } from "../../../../../components/shared/HttpResult";
import { useTask } from "../../../../../hooks/useTask";
import { useBoards } from "../../../../../hooks/useBoards";
import { TaskIdRenderer } from "../../../../../components/shared/TaskIdRenderer";
import { Tooltip } from "../../../../../components/shared/primitives/Tooltip";
import { Text } from "../../../../../components/shared/primitives/Text";

type Props = {
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
};

const RenderParentTaskInfo: React.FC<Props> = ({ task, onTaskSelect }) => {
  const boards = useBoards();
  const taskBoard = boards.find((r) => r.Id === task.BoardId);

  if (!taskBoard) {
    return null;
  }

  return (
    <Tooltip title={`Parent task: ${task.Title}`}>
      <Text onClick={() => onTaskSelect(task)} style={{ cursor: "pointer" }}>
        {taskBoard.Name}
      </Text>
      {" / "}
      <TaskIdRenderer task={task} />
    </Tooltip>
  );
};

export const TaskEditableTitle: React.FC<Props> = ({ task, onTaskSelect }) => {
  const { updateTask, error } = useTaskUpdateProperty(task);
  const [, setTempTitle] = React.useState(task.Title);
  const onUpdatePropertyDebounced = debounce(updateTask, 100);
  const parentTask = useTask(task.ParentTaskItemId);

  return (
    <>
      <div>
        {task.ParentTaskItemId && parentTask && (
          <div>
            <RenderParentTaskInfo
              task={parentTask}
              onTaskSelect={onTaskSelect}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TaskIdRenderer task={task} />
          <Typography.Title
            style={{ flex: 1, padding: 0, margin: 0, paddingLeft: 16 }}
            level={5}
            editable={{
              triggerType: ["icon", "text"],
              autoSize: {
                maxRows: 4,
              },
              onChange: (value) => {
                setTempTitle(value);
                onUpdatePropertyDebounced({
                  property: "Title",
                  value: value,
                });
              },
              onCancel: () => {
                setTempTitle(task.Title);
              },
            }}
          >
            {task.Title}
          </Typography.Title>
        </div>
      </div>
      <HttpResult error={error} />
    </>
  );
};
