import { RollbackOutlined } from "@ant-design/icons";
import { List } from "antd";
import { useTaskUpdateProperty } from "../../../../../../hooks/useTaskUpdateProperty";
import { TaskType } from "../../../../../../types/Project";
import { Confirm } from "../../../../../../components/shared/Confirm";
import { HoverableListItem } from "../../../../../../components/shared/HoverableListItem";
import { UserAvatar } from "../../../../../../components/shared/UserAvatar";
import { TaskIdRenderer } from "../../../../../../components/shared/TaskIdRenderer";
import { Button } from "../../../../../../components/shared/primitives/Button";
import { Tooltip } from "../../../../../../components/shared/primitives/Tooltip";
import { Space } from "../../../../../../components/shared/primitives/Space";

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
