import { useSelector } from "react-redux";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import React from "react";
import styled from "styled-components";
import { useListAllBoardsQuery } from "@app/services/api";

const Wrapper = styled.div`
  border-left: 1px solid #ededed;
  margin-left: 6px;
  margin-top: 8px;
  padding-left: 8px;
`;

const BoardItem = styled.div<{ $active: boolean }>`
  padding: 4px;
  background-color: ${(props) => (props.$active ? "#ededed" : "inherit")};
  border-radius: 4px;

  &:hover {
    background-color: #ededed;
  }
`;

export const BoardList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { data: allBoards } = useListAllBoardsQuery(null);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { goToBoard } = useAppNavigate();

  return (
    <Wrapper>
      {allBoards?.Data.filter((r) => r.ProjectId === projectId).map((r) => (
        <BoardItem
          key={r.Id}
          onClick={() => goToBoard(r)}
          $active={selectedBoardId === r.Id}
        >
          {r.Name}
        </BoardItem>
      ))}
    </Wrapper>
  );
};
