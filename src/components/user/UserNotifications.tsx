import React from "react";
import { useTask } from "../../hooks/useTask";
import {
  useGetUnreadNotificationsCountQuery,
  useListUserNotificationsQuery,
  useSetNotificationsReadMutation,
} from "../../services/api";
import { UserAvatar } from "../shared/UserAvatar";
import { ProList } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { UserNotificationType } from "../../types/User";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { TaskIdRenderer } from "../shared/TaskIdRenderer";
import { useProjectTasks } from "../../hooks/useProjectTasks";
import { Button } from "../shared/primitives/Button";
import { Tooltip } from "../shared/primitives/Tooltip";
import { Space } from "../shared/primitives/Space";

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

const NOTIFICATIONS_DROPDOWN_LIMIT = 5;
const NOTIFICATIONS_ALL_LIMIT = 50;

export const UserNotifications: React.FC<{ showAll: boolean }> = ({
  showAll,
}) => {
  const { data: notifications, isLoading } = useListUserNotificationsQuery(
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
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<
    readonly React.Key[]
  >([]);

  const navigate = useNavigate();
  const { goToTask } = useAppNavigate();
  const { tasks } = useProjectTasks();

  // TODO: check no data chinese text
  return (
    <ProList
      style={{
        width: showAll ? "100%" : 450,
      }}
      rowKey="Id"
      headerTitle={showAll ? undefined : "Notifications"}
      toolBarRender={() => [
        !showAll ? (
          <Button
            key="show-all"
            type="primary"
            onClick={() => navigate("/me/notifications")}
          >
            Show All
          </Button>
        ) : null,
      ]}
      dataSource={notifications?.Data || []}
      loading={isLoading}
      expandable={
        showAll
          ? {}
          : { expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }
      }
      onRow={(record: UserNotificationType) => ({
        onClick: () => {
          if (record.TaskId) {
            const task = tasks?.find((r) => r.Id === record.TaskId);
            if (task) {
              goToTask(task);
            }
          }
        },
      })}
      metas={{
        title: {
          // dataIndex: "Type",
        },
        avatar: {
          render: (_, item) => <UserAvatar userId={item.ByUserId} />,
        },
        subTitle: {
          render: (_, item) => <TaskInfo taskId={item.TaskId} />,
        },
        description: {
          dataIndex: "Content",
        },
      }}
    />
  );
};
