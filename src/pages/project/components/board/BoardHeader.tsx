import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { BoardUserAvatars } from "./BoardUserAvatars";
import { HeaderRightContent } from "@app/layout/HeaderRightContent";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";
import { FilterTaskInput } from "./FilterTaskInput";
import { TaskEditableTitle } from "./task-detail/TaskEditableTitle";
import { selectSelectedTaskId } from "@app/slices/taskDetail/taskDetailSlice";
import { useTask } from "@app/hooks/useTask";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";

const Wrapper = styled.div`
  height: 45px;
  width: calc(100% - 250px);
  display: flex;
  align-items: center;
  padding: 0px 8px;
  position: fixed;
  top: 0px;
  left: 250px;
  z-index: 1;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
  box-shadow: var(--box-shadow);
`;

export const BoardHeader: React.FC = () => {
  const boardComponents = (
    <>
      <Space>
        <FilterTaskInput />
        <BoardUserAvatars />
      </Space>
      <div style={{ flex: 1 }} />
    </>
  );

  const selectedTaskId = useSelector(selectSelectedTaskId);
  const { isLoading, task } = useTask(selectedTaskId);

  const taskComponents = isLoading ? (
    <>
      <LoadingSpin size="small" />
      <div style={{ flex: 1 }} />
    </>
  ) : (
    <>
      <div style={{ marginLeft: 16 }}>
        {task && <TaskEditableTitle task={task} onTaskSelect={() => {}} />}
      </div>
      <div style={{ flex: 1 }} />
    </>
  );

  return (
    <Wrapper>
      {selectedTaskId ? taskComponents : boardComponents}
      <Divider type="vertical" style={{ height: "100%" }} />
      <HeaderRightContent />
    </Wrapper>
  );
};
