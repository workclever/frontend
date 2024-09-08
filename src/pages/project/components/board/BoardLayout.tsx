import { styled } from "styled-components";
import { BoardHeader } from "./BoardHeader";
import { LeftColumn } from "./LeftColumn";
import { useDispatch, useSelector } from "react-redux";
import {
  loadBoardStarted,
  selectBoardLoading,
  selectBoardViewType,
} from "@app/slices/board/boardSlice";
import React from "react";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";

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
  width: 100%;
`;

const ContentWrapper = styled.div`
  margin-top: 45px;
  padding: 0px;
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  background-color: white;
`;

export const BoardLayout: React.FC<{
  children: React.ReactNode;
  mode: "board" | "task";
  projectId?: number;
  boardId?: number;
}> = ({ children, mode, projectId, boardId }) => {
  const dispatch = useDispatch();
  const boardViewType = useSelector(selectBoardViewType);
  const loading = useSelector(selectBoardLoading);

  React.useEffect(() => {
    if (projectId && boardId) {
      dispatch(
        loadBoardStarted({
          boardId: Number(boardId),
          projectId: Number(projectId),
        })
      );
    }
  }, [dispatch, projectId, boardId]);

  const getHeight = () => {
    if (mode === "task") {
      return "100%";
    }
    if (boardViewType === "kanban") {
      return "calc(100vh - 48px)";
    }

    return "100%";
  };

  return (
    <div style={{ display: "flex" }}>
      <LeftWrapper>
        <LeftColumn />
      </LeftWrapper>
      <RightWrapper>
        <BoardHeader mode={mode} />
        <ContentWrapper
          style={{
            height: getHeight(),
          }}
        >
          {loading ? <LoadingSpin /> : children}
        </ContentWrapper>
      </RightWrapper>
    </div>
  );
};
