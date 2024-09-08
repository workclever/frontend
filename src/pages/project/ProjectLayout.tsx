import styled from "styled-components";
import { LeftColumn } from "./components/board/LeftColumn";
import React from "react";

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

export const ProjectLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <LeftWrapper>
        <LeftColumn />
      </LeftWrapper>
      <RightWrapper>{children}</RightWrapper>
    </div>
  );
};
