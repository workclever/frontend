import { styled } from "styled-components";
import { BoardHeader } from "./BoardHeader";
import { LeftColumn } from "./LeftColumn";
import { useSelector } from "react-redux";
import { selectBoardViewType } from "@app/slices/project/projectSlice";

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
  margin-top: 40px;
  padding: 0px;
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  background-color: white;
`;

export const BoardLayout: React.FC<{
  children: React.ReactNode;
  mode: "board" | "task";
}> = ({ children, mode }) => {
  const boardViewType = useSelector(selectBoardViewType);

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
        <BoardHeader showBoardActions={mode === "board"} />
        <ContentWrapper
          style={{
            height: getHeight(),
          }}
        >
          {children}
        </ContentWrapper>
      </RightWrapper>
    </div>
  );
};
