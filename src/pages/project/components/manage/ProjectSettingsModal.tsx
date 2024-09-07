import { ProjectBoards } from "./ProjectBoards";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectUsers } from "./ProjectUsers";
import { CustomFieldList } from "./custom-field/CustomFieldList";
import { SettingsModal } from "@app/components/shared/SettingsModal";
import {
  SettingsIcon,
  UsersIcon,
  SquareDashedKanbanIcon,
  TablePropertiesIcon,
} from "lucide-react";

export const ProjectSettingsModal: React.FC<{
  projectId: number;
  onCancel: () => void;
}> = ({ projectId, onCancel }) => {
  return (
    <SettingsModal
      onCancel={onCancel}
      items={[
        {
          name: "Meta",
          icon: <SettingsIcon size={15} />,
          element: <ProjectMeta projectId={projectId} />,
        },
        {
          name: "Boards",
          icon: <SquareDashedKanbanIcon size={15} />,
          element: <ProjectBoards projectId={projectId} />,
        },
        {
          name: "Users",
          icon: <UsersIcon size={15} />,
          element: <ProjectUsers projectId={projectId} />,
        },
        {
          name: "Custom fields",
          icon: <TablePropertiesIcon size={15} />,
          element: <CustomFieldList projectId={projectId} />,
        },
      ]}
    />
  );
};
