import React from "react";
import styled from "styled-components";
import { FlexBasicLayout } from "@app/components/shared/FlexBasicLayout";
import { Button } from "@app/components/shared/primitives/Button";
import { useNavigate } from "react-router-dom";
import { blue } from "@ant-design/colors";
import { useListUserProjectsQuery } from "@app/services/api";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  HelpCircleIcon,
  PlusIcon,
} from "lucide-react";
import { CreateProjectModal } from "../CreateProjectModal";
import { LeftColumnProjectItem } from "./LeftColumnProjectItem";

const Wrapper = styled.div`
  padding: 12px;
  background-color: #fafafa;
  height: 100%;
`;

const Header = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  padding: 14px;
  width: 250px;
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: var(--box-shadow);
`;

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 250px;
  border-top: 1px solid ${blue[1]};
  border-right: 1px solid #eaeaea;
  padding: 8px;
  height: 45px;
  background-color: white;
`;

const MyProjectsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 25px;
  align-items: center;
`;

const AllProjects = styled.div`
  border-left: 1px solid #ededed;
  overflow-y: auto;
  /* header - MyProjectsWrapper height - bottom */
  height: calc(100vh - 45px - 25px - 45px);
`;

const MyProjectsItem = () => {
  const [showCreateProjectModal, setShowCreateProjectModal] =
    React.useState<boolean>(false);
  return (
    <>
      <MyProjectsWrapper>
        <span style={{ width: "100%" }}>My projects</span>
        <EnhancedDropdownMenu
          items={[
            {
              label: "New project",
              key: "new-project",
              icon: <PlusIcon size={15} />,
              onClick: () => setShowCreateProjectModal(true),
            },
          ]}
          triggerElement={
            <EllipsisVerticalIcon
              size={12}
              style={{
                color: "black",
              }}
            />
          }
        />
        {showCreateProjectModal && (
          <CreateProjectModal
            onCancel={() => setShowCreateProjectModal(false)}
          />
        )}
      </MyProjectsWrapper>
    </>
  );
};

export const LeftColumn = () => {
  const navigate = useNavigate();
  const { data: userProjects } = useListUserProjectsQuery(null);

  return (
    <Wrapper>
      <Header>
        <FlexBasicLayout
          left={
            <div
              onClick={() => navigate(-1)}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ChevronLeftIcon size={24} style={{ paddingRight: 8 }} />
              Back
            </div>
          }
        />
      </Header>
      <div style={{ marginTop: 45 }}>
        <MyProjectsItem />
        <AllProjects>
          {userProjects?.Data.map((project) => {
            return <LeftColumnProjectItem key={project.Id} project={project} />;
          })}
        </AllProjects>
      </div>
      <BottomWrapper>
        <FlexBasicLayout
          left={
            <Button size="small" type="text">
              <HelpCircleIcon size={15} />
            </Button>
          }
        />
      </BottomWrapper>
    </Wrapper>
  );
};
