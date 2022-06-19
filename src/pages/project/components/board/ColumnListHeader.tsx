import styled from "styled-components";

export const ColHeader = styled.div`
  width: 80px;
  color: #adb3bd;
  font-size: 12px;
  text-align: center;
  padding: 4px;
`;

export const ColumnListHeader = () => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}></div>
      <ColHeader>Comments</ColHeader>
      <ColHeader>Subtasks</ColHeader>
      <ColHeader>Assignee</ColHeader>
    </div>
  );
};
