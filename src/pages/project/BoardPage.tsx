import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import { setSelectedProjectId } from "../../slices/project/projectSlice";
import { useParams } from "react-router-dom";
import React from "react";
import { BoardLayout } from "./components/board/BoardLayout";
import { TreeBoardWrapper } from "./components/board/TreeBoardWrapper";
import { KanbanBoardWrapper } from "./components/board/KanbanBoardWrapper";
import {
  selectBoardViewType,
  setSelectedBoardId,
} from "@app/slices/board/boardSlice";

export const BoardPage = () => {
  const dispatch = useDispatch();
  const { projectId, boardId } = useParams();
  const boardViewType = useSelector(selectBoardViewType);

  React.useEffect(() => {
    if (projectId && boardId) {
      dispatch(setSelectedProjectId(Number(projectId)));
      dispatch(setSelectedBoardId(Number(boardId)));
      // dispatch(
      //   loadBoardStarted({
      //     boardId: Number(boardId),
      //     projectId: Number(projectId),
      //   })
      // );
    }
  }, [dispatch, projectId, boardId]);

  const renderBoard = () => {
    if (!boardId) {
      return null;
    }
    return (
      <>
        {boardViewType === "kanban" && (
          <KanbanBoardWrapper
            projectId={Number(projectId)}
            boardId={Number(boardId)}
          />
        )}
        {boardViewType === "tree" && (
          <TreeBoardWrapper projectId={Number(projectId)} />
        )}
      </>
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

  return (
    <BoardLayout
      mode="board"
      projectId={Number(projectId)}
      boardId={Number(boardId)}
    >
      {renderContent()}
    </BoardLayout>
  );
};
