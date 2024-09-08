import { AvatarGroup } from "@app/components/shared/primitives/Avatar";
import { Props } from "../Task";
import { UserAvatar } from "@app/components/shared/UserAvatar";

export const TaskAssigneeUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  if (!task.AssigneeUserIds.length) {
    return null;
  }
  return (
    <>
      <AvatarGroup maxVisible={2}>
        {task.AssigneeUserIds.map((userId) => (
          <UserAvatar key={userId} userId={userId} />
        ))}
      </AvatarGroup>
    </>
  );
};
