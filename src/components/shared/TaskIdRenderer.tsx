import { gray } from "@ant-design/colors";
import { useGetProjectQuery } from "../../services/api";
import { TaskType } from "../../types/Project";
import { Text } from "../shared/primitives/Text";

export const TaskIdRenderer: React.FC<{ task: TaskType }> = ({ task }) => {
  const { data: project } = useGetProjectQuery(task.ProjectId);
  return (
    <Text style={{ color: gray[0], whiteSpace: "nowrap", fontSize: 15 }}>
      {project?.Data.Slug}-{task.Id}
    </Text>
  );
};
