import { gray } from "@ant-design/colors";
import { TaskType } from "../../types/Project";

export const TaskIdRenderer: React.FC<{ task: TaskType }> = ({ task }) => {
  return (
    <span style={{ color: gray[0], whiteSpace: "nowrap", fontSize: 13 }}>
      {task.Slug}
    </span>
  );
};
