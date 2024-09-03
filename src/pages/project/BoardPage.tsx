import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import {
  selectBoardViewType,
  setSelectedProjectId,
  setSelectedBoardId,
} from "../../slices/project/projectSlice";
import { Columns } from "./components/board/Columns";
import { useParams } from "react-router-dom";
import React from "react";
import { BoardLayout } from "./components/board/BoardLayout";

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
      <BoardLayout mode="board">
        {(boardViewType === "kanban" || boardViewType === "list") && (
          <Columns />
        )}
      </BoardLayout>
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
