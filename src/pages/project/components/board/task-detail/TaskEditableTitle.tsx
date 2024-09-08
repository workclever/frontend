import { Typography } from "antd";
import { TaskType } from "@app/types/Project";
import React from "react";
import { debounce } from "lodash";
import { HttpResult } from "@app/components/shared/HttpResult";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { useUpdateTaskPropertyMutation } from "@app/services/api";
import { TaskParentsBreadCrumb } from "./TaskParentsBreadCrumb";
import { PencilIcon } from "lucide-react";
import { TaskParentColumnBreadCrumb } from "./TaskParentColumnBreadCrumb";

type Props = {
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
};

export const TaskEditableTitle: React.FC<Props> = ({ task, onTaskSelect }) => {
  const [update, { error }] = useUpdateTaskPropertyMutation();
  const [, setTempTitle] = React.useState(task.Title);
  const onUpdatePropertyDebounced = debounce(update, 100);

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {task.ParentTaskItemId ? (
          <TaskParentsBreadCrumb task={task} onTaskSelect={onTaskSelect} />
        ) : (
          <TaskParentColumnBreadCrumb task={task} />
        )}
        <TaskIdRenderer task={task} />
        <Typography.Title
          style={{ flex: 1, padding: 0, margin: 0, paddingLeft: 8 }}
          level={5}
          editable={{
            icon: <PencilIcon size={12} />,
            triggerType: ["icon", "text"],
            autoSize: {
              maxRows: 4,
            },
            onChange: (value) => {
              setTempTitle(value);
              onUpdatePropertyDebounced({
                Task: task,
                Params: {
                  property: "Title",
                  value,
                },
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
      <HttpResult error={error} />
    </>
  );
};
