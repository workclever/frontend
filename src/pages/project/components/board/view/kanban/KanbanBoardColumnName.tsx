import { ColumnColor } from "@app/components/shared/ColumnColor";
import { useColumns } from "@app/hooks/useColumns";
import {
  selectSelectedBoardId,
  selectBoardViewType,
} from "@app/slices/board/boardSlice";
import { useSelector } from "react-redux";
import { ColumnMenu } from "../../ColumnMenu";
import { styled } from "styled-components";

const Wrapper = styled.div`
  background-color: transparent;
  padding: 8px;
  cursor: pointer;
  width: 100%;
`;

export const KanbanBoardColumnName: React.FC<{
  columnId: number;
}> = ({ columnId }) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const { columns } = useColumns(Number(selectedBoardId));
  const column = columns.find((r) => r.Id === columnId);

  const boardViewType = useSelector(selectBoardViewType);

  if (!column) {
    return null;
  }

  return (
    <Wrapper>
      <div
        style={{ display: "flex", flex: 1, marginBottom: 0, color: "black" }}
      >
        <ColumnColor
          columnId={column.Id}
          boardId={column.BoardId}
          style={{ marginRight: 8 }}
        />
        <div
          style={{
            ...(boardViewType === "tree" ? { marginRight: 8 } : { flex: 1 }),
          }}
        >
          {column.Name}
        </div>
        <span style={{ marginLeft: 4 }}>
          <ColumnMenu columnId={column.Id} />
        </span>
      </div>
    </Wrapper>
  );
};
