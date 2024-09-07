import { RollbackOutlined } from "@ant-design/icons";
import { TaskType } from "@app/types/Project";
import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Space } from "@app/components/shared/primitives/Space";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import { useUpdateTaskPropertyMutation } from "@app/services/api";

export const SubtaskItem: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
}> = ({ task, onTaskSelect }) => {
  const [update] = useUpdateTaskPropertyMutation();
  const onRemoveParentClick = () => {
    update({
      Task: task,
      Params: {
        property: "ParentTaskItemId",
        value: null,
      },
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
            danger: true,
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
              {task.AssigneeUserIds.map((r) => {
                return <UserAvatar key={r} userId={r} />;
              })}
            </Space>
          </HoverableListItem>
        }
      />
    </>
  );
};
