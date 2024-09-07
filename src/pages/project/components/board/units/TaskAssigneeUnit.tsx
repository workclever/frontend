import { Props } from "../Task";
import { UserAvatar } from "@app/components/shared/UserAvatar";

export const TaskAssigneeUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  if (!task.AssigneeUserIds.length) {
    return null;
  }
  return (
    <>
      {task.AssigneeUserIds.map((r) => (
        <UserAvatar key={r} userId={r} />
      ))}
    </>
  );
};
