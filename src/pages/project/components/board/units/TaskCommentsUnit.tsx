import { gray } from "@ant-design/colors";
import { useListTaskCommentsQuery } from "@app/services/api";
import { selectBoardViewType } from "@app/slices/board/boardSlice";
import { useSelector } from "react-redux";
import { Props } from "../Task";
import { MessageCircleIcon } from "lucide-react";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";

export const TaskCommentsUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  const boardViewType = useSelector(selectBoardViewType);
  const { data: comments } = useListTaskCommentsQuery(task.BoardId);
  const commentsData = comments?.Data || {};
  const taskCommentsCount = (commentsData[task.Id] || []).length;
  const hasTaskComments = taskCommentsCount > 0;

  if (!hasTaskComments) {
    return boardViewType === "kanban" ? null : <>-</>;
  }

  return (
    <Tooltip title={`${taskCommentsCount} comment(s)`}>
      <span style={{ color: gray[8] }}>
        {taskCommentsCount}
        <MessageCircleIcon size={12} style={{ marginLeft: 4 }} />
      </span>
    </Tooltip>
  );
};
