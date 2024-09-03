import { useDeleteTaskMutation } from "@app/services/api";
import { TaskType } from "@app/types/Project";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { Confirm } from "@app/components/shared/Confirm";
import { Permission } from "@app/components/shared/Permission";
import { Button } from "@app/components/shared/primitives/Button";

export const TaskDelete: React.FC<{
  task: TaskType;
  onTaskDelete: (task: TaskType) => void;
}> = ({ task, onTaskDelete }) => {
  const [deleteTask] = useDeleteTaskMutation();
  const onConfirm = () => {
    onTaskDelete(task);
    deleteTask(task.Id);
  };

  return (
    <Permission
      entityClass={EntityClasses.Project}
      entityId={task.ProjectId}
      permission={Permissions.CanManageProject}
      showWarning={false}
    >
      <Confirm.Embed title="Delete task permanently?" onConfirm={onConfirm}>
        <Button danger size="small">
          Delete task
        </Button>
      </Confirm.Embed>
    </Permission>
  );
};
