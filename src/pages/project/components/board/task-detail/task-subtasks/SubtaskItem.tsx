import { RollbackOutlined } from "@ant-design/icons";
import { useTaskUpdateProperty } from "@app/hooks/useTaskUpdateProperty";
import { TaskType } from "@app/types/Project";
import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Space } from "@app/components/shared/primitives/Space";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";

export const SubtaskItem: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
}> = ({ task, onTaskSelect }) => {
  const { updateTask } = useTaskUpdateProperty(task);
  const onRemoveParentClick = () => {
    updateTask({
      property: "ParentTaskItemId",
      value: undefined,
    });
  };

  return (
    <>
      <EnhancedDropdownMenu
        triggers={["contextMenu"]}
        items={[
          {
            key: "1",
            label: "Remove parent task",
            icon: <RollbackOutlined />,
            onClick: onRemoveParentClick,
          },
        ]}
        triggerElement={
          <HoverableListItem onClick={() => onTaskSelect(task)}>
            <div style={{ cursor: "pointer", flex: 1 }}>
              <Space>
                <TaskIdRenderer task={task} /> {task.Title}
              </Space>
            </div>
            <Space>
              {task.AssigneeUserId ? (
                <UserAvatar userId={task.AssigneeUserId} />
              ) : null}
            </Space>
          </HoverableListItem>
        }
      />
    </>
  );
};
