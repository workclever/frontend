import { selectBoardViewType } from "@app/slices/project/projectSlice";
import { Props } from "../Task";
import { useSelector } from "react-redux";
import { UserAvatar } from "@app/components/shared/UserAvatar";

export const TaskAssigneeUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  const boardViewType = useSelector(selectBoardViewType);
  if (!task.AssigneeUserId) {
    return boardViewType === "kanban" ? null : <>-</>;
  }
  return <UserAvatar userId={task.AssigneeUserId} />;
};
