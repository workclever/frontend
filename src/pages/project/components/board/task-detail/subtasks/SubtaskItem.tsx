import { RollbackOutlined } from "@ant-design/icons";
import { List } from "antd";
import { useTaskUpdateProperty } from "@app/hooks/useTaskUpdateProperty";
import { TaskType } from "@app/types/Project";
import { Confirm } from "@app/components/shared/Confirm";
import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Button } from "@app/components/shared/primitives/Button";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { Space } from "@app/components/shared/primitives/Space";

export const SubtaskItem: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
}> = ({ task, onTaskSelect }) => {
  const { updateTask } = useTaskUpdateProperty(task);
  const onConvertToTaskClick = () => {
    updateTask({
      property: "ParentTaskItemId",
      value: undefined,
    });
  };
  return (
    <HoverableListItem>
      <List.Item
        style={{ padding: 0 }}
        extra={
          <>
            <Space>
              {task.AssigneeUserId ? (
                <UserAvatar userId={task.AssigneeUserId} />
              ) : null}
              <Tooltip title="Convert to task?">
                <Confirm.Embed
                  title="Convert to task?"
                  onConfirm={onConvertToTaskClick}
                >
                  <Button
                    icon={<RollbackOutlined />}
                    style={{ fontSize: 14 }}
                    size="small"
                  />
                </Confirm.Embed>
              </Tooltip>
            </Space>
          </>
        }
      >
        <List.Item.Meta
          title={
            <div
              style={{ padding: 5, cursor: "pointer" }}
              onClick={() => onTaskSelect(task)}
            >
              <Space>
                <TaskIdRenderer task={task} /> {task.Title}
              </Space>
            </div>
          }
        />
      </List.Item>
    </HoverableListItem>
  );
};
