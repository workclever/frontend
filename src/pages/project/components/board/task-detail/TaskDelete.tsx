import { useDeleteTaskMutation } from "../../../../../services/api";
import { TaskType } from "../../../../../types/Project";
import { EntityClasses, Permissions } from "../../../../../types/Roles";
import { Confirm } from "../../../../../components/shared/Confirm";
import { Permission } from "../../../../../components/shared/Permission";
import { Button } from "../../../../../components/shared/primitives/Button";

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
        <Button appearance="danger">Delete task</Button>
      </Confirm.Embed>
    </Permission>
  );
};
