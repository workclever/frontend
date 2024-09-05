import { gray } from "@ant-design/colors";
import { useGetProjectQuery } from "../../services/api";
import { TaskType } from "../../types/Project";

export const TaskIdRenderer: React.FC<{ task: TaskType }> = ({ task }) => {
  const { data: project } = useGetProjectQuery(task.ProjectId);
  return (
    <span style={{ color: gray[0], whiteSpace: "nowrap", fontSize: 13 }}>
      {project?.Data.Slug}-{task.Id}
    </span>
  );
};
