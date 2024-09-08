import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import { TaskType } from "@app/types/Project";
import React from "react";
import {
  TableContainer,
  TableRow,
  TableKey,
  TableValue,
  FieldValuePreview,
} from "../fields/FieldContainers";
import { ColumnColor } from "@app/components/shared/ColumnColor";
import { Space } from "antd";
import { TaskMover } from "../../shared/TaskMover";

export const TaskBoardColumn: React.FC<{ task: TaskType }> = ({ task }) => {
  const boards = useBoards();
  const board = boards.find((r) => r.Id === task.BoardId);

  const { columns } = useColumns(task.BoardId);
  const column = columns.find((r) => r.Id === task.ColumnId);

  return (
    <TableContainer>
      <TableRow>
        <TableKey>
          <span>Board</span>
        </TableKey>
        <TableValue>
          <TaskMover task={task} type="in-project">
            <FieldValuePreview>{board?.Name}</FieldValuePreview>
          </TaskMover>
        </TableValue>
      </TableRow>
      {column && (
        <TableRow>
          <TableKey>
            <span>Column</span>
          </TableKey>
          <TableValue>
            <TaskMover task={task} type="in-board">
              <FieldValuePreview>
                <Space>
                  <ColumnColor columnId={column.Id} boardId={column.BoardId} />
                  {column?.Name}
                </Space>
              </FieldValuePreview>
            </TaskMover>
          </TableValue>
        </TableRow>
      )}
    </TableContainer>
  );
};
