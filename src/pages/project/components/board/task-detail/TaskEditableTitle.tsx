import { Typography } from "antd";
import { TaskType } from "@app/types/Project";
import React from "react";
import { debounce } from "lodash";
import { useTaskUpdateProperty } from "@app/hooks/useTaskUpdateProperty";
import { HttpResult } from "@app/components/shared/HttpResult";
import { useTask } from "@app/hooks/useTask";
import { useBoards } from "@app/hooks/useBoards";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { Text } from "@app/components/shared/primitives/Text";

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
                  value,
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
