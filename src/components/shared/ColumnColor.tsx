import { useColumns } from "@app/hooks/useColumns";
import { Badge } from "antd";
import React from "react";

export const ColumnColor: React.FC<{
  columnId: number;
  boardId: number;
  style?: React.CSSProperties;
}> = ({ columnId, boardId, style }) => {
  const { columns } = useColumns(boardId);
  const column = columns.find((r) => r.Id === columnId);

  if (!column) {
    return null;
  }

  return <Badge color={column.Color} style={style} />;
};
