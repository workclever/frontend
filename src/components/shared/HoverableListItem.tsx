import styled from "styled-components";

export const HoverableListItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 8px;
  padding: 2px 8px;

  &:hover {
    background-color: #fafafa;
    cursor: pointer;
  }
`;
