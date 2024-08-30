import {
  ArrowLeftOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FlexBasicLayout } from "../../../../components/shared/FlexBasicLayout";
import { Permission } from "../../../../components/shared/Permission";
import { Button } from "../../../../components/shared/primitives/Button";
import { Modal } from "../../../../components/shared/primitives/Modal";
import { Title } from "../../../../components/shared/primitives/Title";
import { useCurrentProject } from "../../../../hooks/useCurrentProject";
import { selectSelectedProjectId } from "../../../../slices/project/projectSlice";
import { EntityClasses, Permissions } from "../../../../types/Roles";
import { BoardList } from "../BoardList";
import { ProjectSettings } from "../manage/ProjectSettings";
import { useNavigate } from "react-router-dom";
import { blue } from "@ant-design/colors";
import { CreateBoardModal } from "./CreateBoardModal";

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  border-bottom: 1px solid ${blue[1]};
  padding: 14px;
  width: 250px;
  cursor: pointer;
`;

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 250px;
  border-top: 1px solid ${blue[1]};
  border-right: 1px solid ${blue[1]};
  background-color: ${blue[0]};
  padding: 8px;
`;

export const LeftColumn = () => {
  const navigate = useNavigate();
  const project = useCurrentProject();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [showProjectSettingsModal, setShowProjectSettingsModal] =
    React.useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = React.useState(false);

  return (
    <div style={{ padding: 12 }}>
      <Header>
        <FlexBasicLayout
          left={
            <div onClick={() => navigate("/")}>
              <ArrowLeftOutlined style={{ paddingRight: 8 }} />
              Go back
            </div>
          }
        />
      </Header>
      <div style={{ paddingTop: 45 }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Title level={5} style={{ flex: 1 }}>
            {project?.Name}
          </Title>
          <Permission
            entityClass={EntityClasses.Project}
            entityId={Number(selectedProjectId)}
            permission={Permissions.CanManageProject}
            showWarning={false}
          >
            <Button
              size="small"
              onClick={() => setShowCreateBoardModal(true)}
              type="text"
            >
              <PlusOutlined />
            </Button>
          </Permission>
        </div>
        <BoardList />
      </div>
      <BottomWrapper>
        <FlexBasicLayout
          left={
            <Button size="small" type="text">
              <QuestionCircleOutlined />
            </Button>
          }
          right={
            <Permission
              entityClass={EntityClasses.Project}
              entityId={Number(selectedProjectId)}
              permission={Permissions.CanManageProject}
              showWarning={false}
            >
              <Button
                size="small"
                onClick={() => setShowProjectSettingsModal(true)}
                type="text"
              >
                <SettingOutlined />
              </Button>
            </Permission>
          }
        />
      </BottomWrapper>
      <Modal
        title="Project settings"
        onCancel={() => setShowProjectSettingsModal(false)}
        visible={showProjectSettingsModal}
        width={800}
      >
        <div style={{ padding: 8 }}>
          <ProjectSettings />
        </div>
      </Modal>
      {showCreateBoardModal && (
        <CreateBoardModal onCancel={() => setShowCreateBoardModal(false)} />
      )}
    </div>
  );
};
