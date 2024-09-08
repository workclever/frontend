import React, { useEffect } from "react";
import { LayoutWithHeader } from "../layout/LayoutWithHeader";
import { LoggedInLayout } from "../layout/LoggedInLayout";
import { CreateProjectModal } from "./project/components/CreateProjectModal";
import { Button } from "../components/shared/primitives/Button";
import { Space } from "../components/shared/primitives/Space";
import { Empty } from "../components/shared/primitives/Empty";
import { useDispatch } from "react-redux";
import { loadRecentProject } from "@app/slices/app/appSlice";

export const HomePage = () => {
  const dispatch = useDispatch();
  const [showCreateProjectModal, setShowCreateProjectModal] =
    React.useState<boolean>(false);

  useEffect(() => {
    dispatch(loadRecentProject());
  }, [dispatch]);

  const newProjectTrigger = () => {
    return (
      <Empty>
        <Space direction="vertical">
          <div style={{ marginTop: 16 }}>
            You don't have any project! To get started, create a project first
          </div>
          <Button
            type="primary"
            onClick={() => setShowCreateProjectModal(true)}
          >
            Create Now
          </Button>
        </Space>
      </Empty>
    );
  };

  return (
    <LoggedInLayout>
      <LayoutWithHeader title="WorkClever" hideBackButton>
        <>
          {newProjectTrigger()}
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
