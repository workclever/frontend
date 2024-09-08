import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import { setSelectedProjectId } from "../../slices/project/projectSlice";
import { Outlet, useParams } from "react-router-dom";
import React from "react";
import { TreeBoardWrapper } from "./components/board/TreeBoardWrapper";
import { KanbanBoardWrapper } from "./components/board/KanbanBoardWrapper";
import {
  loadBoardStarted,
  selectBoardLoading,
  selectBoardViewType,
  setSelectedBoardId,
} from "@app/slices/board/boardSlice";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";
import { BoardHeader } from "./components/board/BoardHeader";

export const BoardPage = () => {
  const dispatch = useDispatch();
  const { projectId, boardId, taskId } = useParams();
  const boardViewType = useSelector(selectBoardViewType);
  const loading = useSelector(selectBoardLoading);

  React.useEffect(() => {
    if (projectId && boardId) {
      dispatch(setSelectedProjectId(Number(projectId)));
      dispatch(setSelectedBoardId(Number(boardId)));
      dispatch(
        loadBoardStarted({
          boardId: Number(boardId),
          projectId: Number(projectId),
        })
      );
    }
  }, [dispatch, projectId, boardId]);

  const renderBoard = () => {
    if (!boardId) {
      return null;
    }
    if (loading) {
      return <LoadingSpin />;
    }
    return (
      <>
        {boardViewType === "kanban" && (
          <div style={{ padding: 8 }}>
            <KanbanBoardWrapper
              projectId={Number(projectId)}
              boardId={Number(boardId)}
            />
          </div>
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
    <>
      <BoardHeader />
      <div
        style={{
          marginTop: "45px",
          padding: "0px",
          overflowY: "hidden",
          overflowX: "auto",
          width: "100%",
          backgroundColor: "white",
          height: "100%",
        }}
      >
        {taskId ? <Outlet /> : renderContent()}
      </div>
    </>
  );
};
