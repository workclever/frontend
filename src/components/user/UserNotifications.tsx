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
import { Text } from "../shared/primitives/Text";
import { List } from "../shared/primitives/List";

const TaskInfo: React.FC<{ taskId?: number }> = ({ taskId }) => {
  const task = useTask(taskId);
  if (!task) {
    return null;
  }
  return (
    <Tooltip title="Go to task">
      <Text>
        <Space>
          <TaskIdRenderer task={task} />
          {task?.Title}
        </Space>
      </Text>
    </Tooltip>
  );
};

const NOTIFICATIONS_DROPDOWN_LIMIT = 5;
const NOTIFICATIONS_ALL_LIMIT = 50;

// TODO showall
export const UserNotifications: React.FC<{ showAll: boolean }> = ({
  showAll,
}) => {
  const { data: notifications } = useListUserNotificationsQuery(
    showAll ? NOTIFICATIONS_ALL_LIMIT : NOTIFICATIONS_DROPDOWN_LIMIT
  );
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
  const tasks = useProjectTasks();

  if (notifications?.Data.length === 0) {
    return <div>You don't have any notifications</div>;
  }

  return (
    <List
      dataSource={notifications?.Data || []}
      renderItem={(item) => {
        return (
          <div
            onClick={() => {
              if (item.TaskId) {
                // TODO improve goToTask to be in saga
                const task = tasks[item.TaskId];
                if (task) {
                  goToTask(task);
                }
              }
            }}
          >
            <UserAvatar userId={item.ByUserId} />
            <TaskInfo taskId={item.TaskId} />
            {item.Content}
          </div>
        );
      }}
    />
  );
};
