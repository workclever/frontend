import { useSelector } from "react-redux";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import React from "react";
import styled from "styled-components";
import { useListAllBoardsQuery } from "@app/services/api";
import { gray } from "@ant-design/colors";

const Wrapper = styled.div`
  border-left: 1px solid #ededed;
  margin-left: 14px;
  margin-top: 8px;
  padding-left: 16px;
`;

const BoardItem = styled.div<{ $active: boolean }>`
  padding: 4px;
  background-color: ${(props) => (props.$active ? "#ededed" : "inherit")};
  border-radius: 4px;
  cursor: pointer;
  transition: all 100ms ease-in;

  &:hover {
    background-color: #ededed;
  }
`;

export const BoardList: React.FC<{
  projectId: number;
  onCreateNewBoardClick: () => void;
}> = ({ projectId }) => {
  const { data: allBoards } = useListAllBoardsQuery(null);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { goToBoard } = useAppNavigate();

  const boards = allBoards?.Data.filter((r) => r.ProjectId === projectId);

  if (boards?.length === 0) {
    return (
      <Wrapper style={{ color: gray[0], fontSize: 13, marginBottom: 8 }}>
        There is no board in this project
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {boards?.map((r) => (
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
