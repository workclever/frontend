import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button } from "../../components/shared/primitives/Button";
import { Empty } from "../../components/shared/primitives/Empty";
import { Space } from "../../components/shared/primitives/Space";
import {
  selectSelectedBoardId,
  selectBoardViewType,
} from "../../slices/projectSlice";
import { BoardHeader } from "./components/board/BoardHeader";
import { Columns } from "./components/board/Columns";
import { LeftColumn } from "./components/board/LeftColumn";

const LeftWrapper = styled.div`
  width: 250px;
  background-color: var(--purple3);
  border-right: 1px solid var(--purple5);
  flex-shrink: 0;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  z-index: 2;
`;

const RightWrapper = styled.div`
  margin-left: 250px;
  background-color: var(--gray1);
`;

const ColumnsWrapper = styled.div`
  margin-top: 40px;
  padding: 8px;
  overflow-y: auto;
  overflow-x: auto;
  height: calc(100vh - 48px);
  width: 100%;
`;

export const BoardPage = () => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const boardViewType = useSelector(selectBoardViewType);

  const renderBoard = () => {
    if (!selectedBoardId) {
      return null;
    }
    return (
      <div style={{ display: "flex" }}>
        <LeftWrapper>
          <LeftColumn />
        </LeftWrapper>
        <RightWrapper>
          <BoardHeader />
          <ColumnsWrapper>
            {(boardViewType === "kanban" || boardViewType === "list") && (
              <Columns />
            )}
          </ColumnsWrapper>
        </RightWrapper>
      </div>
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
    if (selectedBoardId) {
      return renderBoard();
    }
    return newBoardTrigger();
  };

  return <>{renderContent()}</>;
};
