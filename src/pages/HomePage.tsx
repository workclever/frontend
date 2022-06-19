import React, { useContext } from "react";
import { SiteContext } from "../contexts/SiteContext";
import { LayoutWithHeader } from "../layout/LayoutWithHeader";
import { LoggedInLayout } from "../layout/LoggedInLayout";
import { CreateProjectModal } from "./project/components/CreateProjectModal";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { ShinyList } from "../components/shared/ShinyList";
import { ProjectType } from "../types/Project";
import { Button } from "../components/shared/primitives/Button";
import { Space } from "../components/shared/primitives/Space";
import { Empty } from "../components/shared/primitives/Empty";

export const HomePage = () => {
  const { goToProject } = useAppNavigate();
  const { userProjects } = useContext(SiteContext);
  const [showCreateProjectModal, setShowCreateProjectModal] =
    React.useState<boolean>(false);

  const newProjectTrigger = () => {
    return (
      <Empty>
        <>
          <Space direction="vertical">
            <span>
              You don't have any project! To get started, create a project first
            </span>
            <Button
              type="primary"
              onClick={() => setShowCreateProjectModal(true)}
              size="large"
            >
              Create Now
            </Button>
          </Space>
        </>
      </Empty>
    );
  };

  const renderContent = () => {
    if (userProjects.length === 0) {
      return newProjectTrigger();
    }

    return (
      <ShinyList<ProjectType>
        title="Your projects"
        dataSource={userProjects}
        nameProp="Name"
        subtitleProp="Slug"
        onClick={(r) => goToProject(r.Id)}
        newButtonText="New project"
        onNewClick={() => setShowCreateProjectModal(true)}
      />
    );
  };

  return (
    <LoggedInLayout>
      <LayoutWithHeader title="WorkClever" hideBackButton>
        <>
          {renderContent()}
          {showCreateProjectModal && (
            <CreateProjectModal
              onCancel={() => setShowCreateProjectModal(false)}
            />
          )}
        </>
      </LayoutWithHeader>
    </LoggedInLayout>
  );
};
