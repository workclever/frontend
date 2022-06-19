import { useSelector } from "react-redux";
import { selectSelectedBoardId } from "../../../slices/projectSlice";
import { useAppNavigate } from "../../../hooks/useAppNavigate";
import React from "react";
import { useBoards } from "../../../hooks/useBoards";
import styled from "styled-components";

const BoardItem = styled.div<{ active: boolean }>`
  color: var(--gray12);
  cursor: pointer;
  padding: 4px;
  background-color: ${(props) => (props.active ? "var(--purple6)" : "inherit")};
  border-radius: 4px;

  &:hover {
    background-color: var(--purple5);
  }
`;

export const BoardList: React.FC = () => {
  const boards = useBoards();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { goToBoard } = useAppNavigate();

  return (
    <div>
      {boards.map((r) => (
        <BoardItem
          key={r.Id}
          onClick={() => goToBoard(r)}
          active={selectedBoardId === r.Id}
        >
          {r.Name}
        </BoardItem>
      ))}
    </div>
  );
};
