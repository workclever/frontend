import { gray } from "@ant-design/colors";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import { Permission } from "@app/components/shared/Permission";
import {
  PlusIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";
import { BoardList } from "../BoardList";
import React from "react";
import { styled } from "styled-components";
import { ProjectType } from "@app/types/Project";
import { ProjectSettingsModal } from "../manage/ProjectSettingsModal";
import { CreateBoardModal } from "./CreateBoardModal";
import { EntityClasses, Permissions } from "@app/types/Roles";

const Wrapper = styled.div`
  &:hover .project-settings-icon {
    display: inline-block !important;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  margin-left: 8px;
  cursor: pointer;
`;

export const LeftColumnProjectItem: React.FC<{ project: ProjectType }> = ({
  project,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const [showProjectSettingsModal, setShowProjectSettingsModal] =
    React.useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = React.useState(false);

  return (
    <>
      <Wrapper key={project.Id}>
        <Item>
          <div
            style={{
              flex: 1,
              color: gray[5],
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDownIcon size={12} style={{ color: "gray" }} />
            ) : (
              <ChevronRightIcon size={12} style={{ color: "gray" }} />
            )}
            <span style={{ marginLeft: 8 }}>{project.Name}</span>
          </div>
          <Permission
            entityClass={EntityClasses.Project}
            entityId={project.Id}
            permission={Permissions.CanManageProject}
            showWarning={false}
          >
            <EnhancedDropdownMenu
              triggers={["hover"]}
              items={[
                {
                  key: "1",
                  label: "Create new board",
                  icon: <PlusIcon size={12} />,
                  onClick: () => {
                    setShowCreateBoardModal(true);
                  },
                },
                {
                  key: "2",
                  label: "Project settings",
                  icon: <SettingsIcon size={12} />,
                  onClick: () => {
                    setShowProjectSettingsModal(true);
                  },
                },
              ]}
              triggerElement={
                <span style={{ cursor: "pointer" }}>
                  <SettingsIcon
                    size={12}
                    style={{
                      color: "black",
                      display: "none",
                    }}
                    className="project-settings-icon"
                  />
                </span>
              }
            />
          </Permission>
        </Item>
        {expanded && (
          <BoardList
            projectId={project.Id}
            onCreateNewBoardClick={() => setShowCreateBoardModal(true)}
          />
        )}
      </Wrapper>
      {showProjectSettingsModal ? (
        <ProjectSettingsModal
          projectId={project.Id}
          onCancel={() => setShowProjectSettingsModal(false)}
        />
      ) : null}
      {showCreateBoardModal && (
        <CreateBoardModal
          onCancel={() => setShowCreateBoardModal(false)}
          projectId={project.Id}
        />
      )}
    </>
  );
};
