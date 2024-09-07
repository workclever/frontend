import { Avatar } from "antd";
import { Props } from "../Task";
import { UserAvatar } from "@app/components/shared/UserAvatar";

export const TaskAssigneeUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  if (!task.AssigneeUserIds.length) {
    return null;
  }
  return (
    <>
      <Avatar.Group max={{ popover: { trigger: "click" } }}>
        {task.AssigneeUserIds.map((userId) => (
          <UserAvatar key={userId} userId={userId} />
        ))}
      </Avatar.Group>
    </>
  );
};
