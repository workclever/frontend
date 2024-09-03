import { styled } from "styled-components";
import { BoardHeader } from "./BoardHeader";
import { Columns } from "./Columns";
import { LeftColumn } from "./LeftColumn";

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
  padding: 8px;
  overflow-y: auto;
  overflow-x: auto;
  height: calc(100vh - 48px);
  width: 100%;
`;

export const BoardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <LeftWrapper>
        <LeftColumn />
      </LeftWrapper>
      <RightWrapper>
        <BoardHeader />
        <ContentWrapper>{children}</ContentWrapper>
      </RightWrapper>
    </div>
  );
};
