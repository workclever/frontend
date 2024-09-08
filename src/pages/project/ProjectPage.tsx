import { Outlet } from "react-router-dom";
import { ProjectLayout } from "./ProjectLayout";

export const ProjectPage = () => {
  return (
    <ProjectLayout>
      <Outlet />
    </ProjectLayout>
  );
};
