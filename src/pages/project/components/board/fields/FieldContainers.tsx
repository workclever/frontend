import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { styled } from "styled-components";

export const TableContainer = styled.div``;

export const TableRow = styled.div`
  display: flex;
  min-height: 30px;
  align-items: center;
  padding: 2px 0px;
`;

export const TableKey = styled.div`
  width: 100px;
  font-size: 13px;
  color: #333333;
  font-weight: 500;
`;

export const TableValue = styled.div`
  flex: 1;
  width: 100%;
`;

export const FieldValuePreview = styled(HoverableListItem)`
  padding: 4px;
  margin-bottom: 0px;
  color: gray;
`;
