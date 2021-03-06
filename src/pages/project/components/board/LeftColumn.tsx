import {
  ArrowLeftOutlined,
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
import { selectSelectedProjectId } from "../../../../slices/projectSlice";
import { EntityClasses, Permissions } from "../../../../types/Roles";
import { BoardList } from "../BoardList";
import { ProjectSettings } from "../manage/ProjectSettings";
import { useNavigate } from "react-router-dom";

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--purple9);
  border-bottom: 2px solid var(--purple8);
  padding: 14px;
  width: 250px;
  color: var(--gray2);
  cursor: pointer;
`;

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 250px;
  border-top: 1px solid var(--purple4);
  background-color: var(--purple3);
  padding: 8px;
`;

export const LeftColumn = () => {
  const navigate = useNavigate();
  const project = useCurrentProject();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [projectSettingsVisible, setProjectSettingsVisible] =
    React.useState(false);

  const showProjectSettings = () => {
    setProjectSettingsVisible(true);
  };

  const onClose = () => {
    setProjectSettingsVisible(false);
  };

  return (
    <div style={{ padding: 12 }}>
      <Header>
        <FlexBasicLayout
          left={
            <div onClick={() => navigate("/")}>
              <ArrowLeftOutlined
                style={{ color: "var(--gray2)", paddingRight: 8 }}
              />
              Go back
            </div>
          }
        />
      </Header>
      <div style={{ paddingTop: 45 }}>
        <Title level={5}>{project?.Name}</Title>
        <BoardList />
      </div>
      <BottomWrapper>
        <FlexBasicLayout
          left={
            <Button size="small" type="text">
              <QuestionCircleOutlined style={{ color: "var(--gray10)" }} />
            </Button>
          }
          right={
            <Permission
              entityClass={EntityClasses.Project}
              entityId={Number(selectedProjectId)}
              permission={Permissions.CanManageProject}
              showWarning={false}
            >
              <Button size="small" onClick={showProjectSettings} type="text">
                <SettingOutlined style={{ color: "var(--gray10)" }} />
              </Button>
            </Permission>
          }
        />
      </BottomWrapper>
      <Modal
        title="Project settings"
        onCancel={onClose}
        visible={projectSettingsVisible}
        width={800}
      >
        <div style={{ padding: 8 }}>
          <ProjectSettings />
        </div>
      </Modal>
    </div>
  );
};
