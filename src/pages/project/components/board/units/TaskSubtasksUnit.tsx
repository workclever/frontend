import { selectBoardViewType } from "@app/slices/project/projectSlice";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { Props } from "../Task";
import { NetworkIcon } from "lucide-react";

export const TaskSubtasksUnit: React.FC<
  Pick<Props, "task" | "findSubtasks">
> = ({ task, findSubtasks }) => {
  const boardViewType = useSelector(selectBoardViewType);
  const subtasks = findSubtasks(task.Id) || [];
  const hasSubtasks = subtasks.length > 0;
  if (!hasSubtasks) {
    return boardViewType === "kanban" ? null : <>-</>;
  }

  return (
    <Tooltip title={`${subtasks.length} subtasks(s)`}>
      <span>
        {subtasks.length}
        <NetworkIcon size={12} style={{ marginLeft: 4 }} />
      </span>
    </Tooltip>
  );
};
