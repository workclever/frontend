import { Segmented } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectBoardViewType,
  setBoardViewType,
} from "@app/slices/board/boardSlice";
import { BoardViewType } from "@app/types/Project";
import { BoardUserAvatars } from "./BoardUserAvatars";
import { BoardHeaderRightContent } from "@app/layout/BoardHeaderRightContent";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";
import { FilterTaskInput } from "./FilterTaskInput";
import { TaskEditableTitle } from "./task-detail/TaskEditableTitle";
import { selectSelectedTaskId } from "@app/slices/taskDetail/taskDetailSlice";
import { useTask } from "@app/hooks/useTask";
import { NetworkIcon, SquareDashedKanbanIcon } from "lucide-react";
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
`;

export const BoardHeader: React.FC<{ mode: "board" | "task" }> = ({ mode }) => {
  const dispatch = useDispatch();
  const boardViewType = useSelector(selectBoardViewType);

  const updateBoardViewType = (type: BoardViewType) => {
    setTimeout(() => {
      dispatch(setBoardViewType(type));
    }, 300);
  };

  const boardComponents = (
    <>
      <Space>
        <FilterTaskInput />
        <BoardUserAvatars />
      </Space>
      <div style={{ flex: 1 }} />
      <Segmented
        size="small"
        value={boardViewType}
        onChange={(e) => updateBoardViewType(e as BoardViewType)}
        options={[
          {
            value: "kanban",
            icon: <SquareDashedKanbanIcon size={12} />,
            label: "Kanban",
          },
          {
            value: "tree",
            icon: <NetworkIcon size={12} />,
            label: "Tree",
          },
        ]}
      />
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
      {mode === "board" && boardComponents}
      {mode === "task" && taskComponents}
      <Divider type="vertical" style={{ height: "100%" }} />
      <BoardHeaderRightContent />
    </Wrapper>
  );
};
