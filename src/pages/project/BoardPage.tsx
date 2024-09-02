import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import {
  selectBoardViewType,
  setSelectedProjectId,
  setSelectedBoardId,
} from "../../slices/project/projectSlice";
import { BoardHeader } from "./components/board/BoardHeader";
import { Columns } from "./components/board/Columns";
import { LeftColumn } from "./components/board/LeftColumn";
import { useParams } from "react-router-dom";
import React from "react";

const LeftWrapper = styled.div`
  width: 250px;
  border-right: 1px solid #eaeaea;
  flex-shrink: 0;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  z-index: 2;
`;

const RightWrapper = styled.div`
  margin-left: 250px;
`;

const ColumnsWrapper = styled.div`
  margin-top: 40px;
  padding: 8px;
  overflow-y: auto;
  overflow-x: auto;
  height: calc(100vh - 48px);
  width: 100%;
`;

export const BoardPage = () => {
  const dispatch = useDispatch();
  const { projectId, boardId } = useParams();
  const boardViewType = useSelector(selectBoardViewType);

  React.useEffect(() => {
    if (projectId) {
      dispatch(setSelectedProjectId(Number(projectId)));
    }
  }, [projectId]);

  React.useEffect(() => {
    if (boardId) {
      dispatch(setSelectedBoardId(Number(boardId)));
    }
  }, [boardId]);

  const renderBoard = () => {
    if (!boardId) {
      return null;
    }
    return (
      <div style={{ display: "flex" }}>
        <LeftWrapper>
          <LeftColumn />
        </LeftWrapper>
        <RightWrapper>
          <BoardHeader />
          <ColumnsWrapper>
            {(boardViewType === "kanban" || boardViewType === "list") && (
              <Columns />
            )}
          </ColumnsWrapper>
        </RightWrapper>
      </div>
    );
  };

  const newBoardTrigger = () => {
    return (
      <Empty>
        <>
          <Space direction="vertical">
            <span>
              There is no board in this project, create a board to be able to
              create tasks
            </span>
            <Button type="primary" size="large">
              Create Now
            </Button>
          </Space>
        </>
      </Empty>
    );
  };

  const renderContent = () => {
    if (boardId) {
      return renderBoard();
    }
    return newBoardTrigger();
  };

  return <>{renderContent()}</>;
};
