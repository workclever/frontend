import React from "react";
import { useTask } from "../../hooks/useTask";
import {
  useGetUnreadNotificationsCountQuery,
  useListUserNotificationsQuery,
  useSetNotificationsReadMutation,
} from "../../services/api";
import { UserAvatar } from "../shared/UserAvatar";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { TaskIdRenderer } from "../shared/TaskIdRenderer";
import { useProjectTasks } from "../../hooks/useProjectTasks";
import { Tooltip } from "../shared/primitives/Tooltip";
import { Space } from "../shared/primitives/Space";
import { UserNotificationType } from "@app/types/User";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { Empty } from "../shared/primitives/Empty";

const TaskInfo: React.FC<{ taskId: number | null }> = ({ taskId }) => {
  const { task } = useTask(taskId);
  if (!task) {
    return null;
  }
  return (
    <Tooltip title="Go to task">
      <Space>
        <TaskIdRenderer task={task} />
        {task?.Title}
      </Space>
    </Tooltip>
  );
};

const NotificationRow: React.FC<{ item: UserNotificationType }> = ({
  item,
}) => {
  const formattedDateTime = useFormattedDateTime(item.DateCreated);
  return (
    <>
      <div style={{ display: "flex", gap: 8 }}>
        <UserAvatar userId={item.ByUserId} />
        <TaskInfo taskId={item.TaskId} />
        {item.Content}
      </div>
      <span style={{ color: "gray", fontSize: 12 }}>{formattedDateTime}</span>
    </>
  );
};

export const UserNotifications = () => {
  const { data: notifications } = useListUserNotificationsQuery(1000);
  const [setNotificationsRead] = useSetNotificationsReadMutation();
  const { data: unreadNotificationsCount } =
    useGetUnreadNotificationsCountQuery(null);

  React.useEffect(() => {
    // Set notifications read, only if we have some unread notifications
    const count = Number(unreadNotificationsCount?.Data);
    if (count > 0) {
      setNotificationsRead(null);
    }
  }, [setNotificationsRead, unreadNotificationsCount]);

  const { goToTask } = useAppNavigate();
  const { tasks } = useProjectTasks();

  const onClickRow = (taskId: number | null) => {
    const task = tasks?.find((r) => r.Id === taskId);
    if (task) {
      goToTask(task);
    }
  };

  if (!notifications?.Data.length) {
    return <Empty>You don't have any notifications yet</Empty>;
  }

  return (
    <div
      style={{
        width: 450,
        maxHeight: 600,
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", fontWeight: "bold", marginBottom: 16 }}>
        Notifications
      </div>
      {notifications?.Data.map((r) => {
        return (
          <div
            key={r.Id}
            onClick={() => onClickRow(r.TaskId)}
            style={{ marginBottom: 16 }}
          >
            <NotificationRow item={r} />
          </div>
        );
      })}
    </div>
  );
};
