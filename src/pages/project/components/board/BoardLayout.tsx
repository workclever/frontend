import { styled } from "styled-components";
import { BoardHeader } from "./BoardHeader";
import React from "react";

const ContentWrapper = styled.div`
  margin-top: 45px;
  padding: 0px;
  overflow-y: hidden;
  overflow-x: auto;
  width: 100%;
  background-color: white;
  height: "100%;
`;

export const BoardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <BoardHeader />
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
};
