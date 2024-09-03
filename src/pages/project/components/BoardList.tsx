import { useSelector } from "react-redux";
import { selectSelectedBoardId } from "@app/slices/project/projectSlice";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import React from "react";
import styled from "styled-components";
import { blue } from "@ant-design/colors";
import { useListAllBoardsQuery } from "@app/services/api";

const BoardItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  padding: 4px;
  background-color: ${(props) => (props.active ? blue[0] : "inherit")};
  border-radius: 4px;

  &:hover {
    background-color: ${blue[1]};
  }
`;

export const BoardList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { data: allBoards } = useListAllBoardsQuery(null);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { goToBoard } = useAppNavigate();

  return (
    <div>
      {allBoards?.Data.filter((r) => r.ProjectId === projectId).map((r) => (
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
