import { FlexBasicLayout } from "@app/components/shared/FlexBasicLayout";
import { useColumns } from "@app/hooks/useColumns";
import {
  selectSelectedBoardId,
  selectBoardViewType,
} from "@app/slices/board/boardSlice";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import { ColumnTreeHeader } from "./ColumnTreeHeader";
import { ColumnColor } from "@app/components/shared/ColumnColor";
import { ColumnMenu } from "../../ColumnMenu";

const Wrapper = styled.div`
  padding: 8px;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  background-color: #f7f7f7;
  box-shadow: var(--box-shadow);
`;

export const TreeBoardColumnName: React.FC<{
  columnId: number;
  toggleOpen?: () => void;
}> = ({ columnId, toggleOpen }) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const { columns } = useColumns(Number(selectedBoardId));
  const column = columns.find((r) => r.Id === columnId);

  const boardViewType = useSelector(selectBoardViewType);

  if (!column) {
    return null;
  }

  return (
    <Wrapper onClick={toggleOpen}>
      <FlexBasicLayout
        left={
          <div
            style={{
              display: "flex",
              flex: 1,
              marginBottom: 0,
              color: "black",
            }}
          >
            <ColumnColor
              columnId={column.Id}
              boardId={column.BoardId}
              style={{ marginRight: 8 }}
            />
            <div
              style={{
                ...(boardViewType === "tree"
                  ? { marginRight: 8 }
                  : { flex: 1 }),
              }}
            >
              {column.Name}
            </div>
            <span style={{ marginLeft: 4 }}>
              <ColumnMenu columnId={column.Id} />
            </span>
          </div>
        }
        right={<ColumnTreeHeader />}
      />
    </Wrapper>
  );
};
