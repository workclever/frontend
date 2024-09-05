import styled from "styled-components";

export const ColHeader = styled.div`
  width: 80px;
  color: #adb3bd;
  font-size: 12px;
  text-align: center;
  padding: 4px;
`;

export const ColumnTreeHeader = () => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}></div>
      <ColHeader>Comments</ColHeader>
      <ColHeader>Assignee</ColHeader>
    </div>
  );
};
