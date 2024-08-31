// import { RollbackOutlined } from "@ant-design/icons";
import { useTaskUpdateProperty } from "../../../../../../hooks/useTaskUpdateProperty";
import { TaskType } from "../../../../../../types/Project";
import { Confirm } from "../../../../../../components/shared/Confirm";
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
    <>
      <div
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <div
          style={{ padding: 5, cursor: "pointer", flex: 1 }}
          onClick={() => onTaskSelect(task)}
        >
          <Space>
            <TaskIdRenderer task={task} /> {task.Title}
          </Space>
        </div>
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
              // TODOAK iconAfter={<RollbackOutlined />}
              // TODOAK  style={{ fontSize: 14 }}
              >
                subs
              </Button>
            </Confirm.Embed>
          </Tooltip>
        </Space>
      </div>
    </>
  );
};
