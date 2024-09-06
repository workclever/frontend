import { ProjectOutlined } from "@ant-design/icons";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useListUserProjectsQuery } from "@app/services/api";
import { Command } from "cmdk";

export const CommandMenuProjects: React.FC<{
  search: string;
  onClose: () => void;
}> = ({ search, onClose }) => {
  const { goToProject } = useAppNavigate();
  const { data: userProjects } = useListUserProjectsQuery(null);
  const filteredProjects = userProjects?.Data.filter((project) =>
    project.Name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredProjects?.length === 0) {
    return null;
  }

  return (
    <Command.Group heading="Projects">
      {filteredProjects?.map((project) => (
        <Command.Item
          key={project.Id}
          onSelect={() => {
            goToProject(project.Id);
            onClose();
          }}
        >
          <ProjectOutlined style={{ marginRight: 8, color: "gray" }} />
          {project.Name}
        </Command.Item>
      ))}
    </Command.Group>
  );
};
