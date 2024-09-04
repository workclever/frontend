import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  PlusOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";
import styled from "styled-components";
import { FlexBasicLayout } from "@app/components/shared/FlexBasicLayout";
import { Permission } from "@app/components/shared/Permission";
import { Button } from "@app/components/shared/primitives/Button";
import { Modal } from "@app/components/shared/primitives/Modal";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { BoardList } from "../BoardList";
import { ProjectSettings } from "../manage/ProjectSettings";
import { useNavigate } from "react-router-dom";
import { blue, gray } from "@ant-design/colors";
import { CreateBoardModal } from "./CreateBoardModal";
import { useListUserProjectsQuery } from "@app/services/api";
import { useDispatch } from "react-redux";
import { setSelectedProjectId } from "@app/slices/project/projectSlice";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";

const Wrapper = styled.div`
  padding: 12px;
  background-color: #fafafa;
  height: 100%;
`;

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  border-bottom: 1px solid #eaeaea;
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
  border-right: 1px solid #eaeaea;
  padding: 8px;
`;

const ProjectItemWrapper = styled.div`
  &:hover .project-settings-icon {
    display: inline-block !important;
  }
`;

const ProjectItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`;

export const LeftColumn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProjectSettingsModal, setShowProjectSettingsModal] =
    React.useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = React.useState(false);
  const { data: userProjects } = useListUserProjectsQuery(null);

  return (
    <Wrapper>
      <Header>
        <FlexBasicLayout
          left={
            <div onClick={() => navigate(-1)}>
              <ArrowLeftOutlined style={{ paddingRight: 8 }} />
              Back
            </div>
          }
        />
      </Header>
      <div style={{ marginTop: 45 }}>
        {/* <div style={{ marginBottom: 8 }}>Your projects</div> */}
        {userProjects?.Data.map((project) => {
          return (
            <ProjectItemWrapper key={project.Id}>
              <ProjectItem>
                <div
                  style={{
                    flex: 1,
                    color: gray[4],
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ProjectOutlined
                    style={{ fontSize: "11px", color: "gray" }}
                  />
                  <span style={{ marginLeft: 8 }}>{project?.Name}</span>
                </div>
                <Permission
                  entityClass={EntityClasses.Project}
                  entityId={project.Id}
                  permission={Permissions.CanManageProject}
                  showWarning={false}
                >
                  <EnhancedDropdownMenu
                    items={[
                      {
                        key: "1",
                        label: "Create new board",
                        icon: <PlusOutlined />,
                        onClick: () => {
                          dispatch(setSelectedProjectId(project.Id));
                          setShowCreateBoardModal(true);
                        },
                      },
                      {
                        key: "2",
                        label: "Project settings",
                        icon: <SettingOutlined />,
                        onClick: () => {
                          dispatch(setSelectedProjectId(project.Id));
                          setShowProjectSettingsModal(true);
                        },
                      },
                    ]}
                    triggerElement={
                      <span style={{ cursor: "pointer" }}>
                        <EllipsisOutlined
                          style={{
                            fontSize: "14px",
                            color: "black",
                            display: "none",
                          }}
                          className="project-settings-icon"
                        />
                      </span>
                    }
                  />
                </Permission>
              </ProjectItem>
              <BoardList projectId={project.Id} />
            </ProjectItemWrapper>
          );
        })}
      </div>
      <BottomWrapper>
        <FlexBasicLayout
          left={
            <Button size="small" type="text">
              <QuestionCircleOutlined />
            </Button>
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
    </Wrapper>
  );
};
