import React from "react";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { TaskType } from "@app/types/Project";
import { useTask } from "@app/hooks/useTask";
import { gray } from "@ant-design/colors";
import { ChevronRightIcon } from "lucide-react";

type Props = {
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
};

const Arrow = () => (
  <ChevronRightIcon
    size={30}
    style={{
      paddingLeft: 8,
      paddingRight: 8,
      color: gray[0],
    }}
  />
);

const ParentTaskItem: React.FC<Props> = ({ task, onTaskSelect }) => {
  const { task: parentTask } = useTask(task.ParentTaskItemId);

  if (!task.ParentTaskItemId || !parentTask) {
    return null;
  }

  return (
    <>
      <TaskParentsBreadCrumb task={parentTask} onTaskSelect={onTaskSelect} />
      <Tooltip title={parentTask.Title}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TaskIdRenderer task={parentTask} />
          <Arrow />
        </div>
      </Tooltip>
    </>
  );
};

export const TaskParentsBreadCrumb: React.FC<Props> = ({
  task,
  onTaskSelect,
}) => {
  return <ParentTaskItem task={task} onTaskSelect={onTaskSelect} />;
};
