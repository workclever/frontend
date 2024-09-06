import { Select } from "antd";
import React from "react";
import { useBoards } from "@app/hooks/useBoards";
import { TaskType } from "@app/types/Project";
import styled from "styled-components";
import { useColumns } from "@app/hooks/useColumns";
import { useMoveTaskToColumnMutation } from "@app/services/api";
import { HttpResult } from "@app/components/shared/HttpResult";
import { Popover } from "@app/components/shared/primitives/Popover";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { TabPane, Tabs } from "@app/components/shared/primitives/Tabs";

const SelectTitle = styled.div`
  font-weight: bold;
`;

type Props = {
  task: TaskType;
};

export const TaskMover: React.FC<Props> = ({ task }) => {
  const [tempBoardId, setTempBoardId] = React.useState<number>(task.BoardId);
  const [tempColumnId, setTempColumnId] = React.useState<number>(task.ColumnId);
  const boards = useBoards();
  const { columns } = useColumns(tempBoardId);

  const [moveTask, { isLoading: isMoving, error, data }] =
    useMoveTaskToColumnMutation();
  const hasNoColumns = columns.length === 0;

  React.useEffect(() => {
    const hasNoColumns = columns.length === 0;
    if (!hasNoColumns) {
      if (columns.find((c) => c.Id === task.ColumnId)) {
        setTempColumnId(task.ColumnId);
      } else {
        setTempColumnId(columns[0].Id);
      }
    }
  }, [columns, task]);

  const onMoveButtonClick = async () => {
    moveTask({
      TargetBoardId: tempBoardId,
      TargetColumnId: tempColumnId,
      Task: task,
    });
  };

  const inThisBoard = (
    <Space direction="vertical">
      <div>
        <SelectTitle>Column</SelectTitle>
        <Select
          style={{ width: 150 }}
          placeholder="Column"
          value={tempColumnId}
          onChange={setTempColumnId}
          allowClear={true}
          disabled={hasNoColumns}
        >
          {columns.map((column) => (
            <Select.Option key={column.Id} value={column.Id}>
              {column.Name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Button
        disabled={hasNoColumns || isMoving}
        style={{ marginTop: 4 }}
        onClick={onMoveButtonClick}
        loading={isMoving}
      >
        Move
      </Button>
      <HttpResult error={error} result={data} style={{ marginTop: 4 }} />
    </Space>
  );

  const otherBoard = (
    <Space direction="vertical">
      <div>
        <SelectTitle>Board</SelectTitle>
        <Select
          style={{ width: 150 }}
          placeholder="Board"
          value={tempBoardId}
          onChange={setTempBoardId}
          allowClear={true}
        >
          {boards.map((board) => (
            <Select.Option key={board.Id} value={board.Id}>
              {board.Name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <SelectTitle>Column</SelectTitle>
        <Select
          style={{ width: 150 }}
          placeholder="Column"
          value={tempColumnId}
          onChange={setTempColumnId}
          allowClear={true}
          disabled={hasNoColumns}
        >
          {columns.map((column) => (
            <Select.Option key={column.Id} value={column.Id}>
              {column.Name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Button
        disabled={hasNoColumns || isMoving}
        style={{ marginTop: 4 }}
        onClick={onMoveButtonClick}
        loading={isMoving}
      >
        Move
      </Button>
      <HttpResult error={error} result={data} style={{ marginTop: 4 }} />
    </Space>
  );

  return (
    <Popover
      placement="bottom"
      content={
        <Tabs
          defaultActiveKey="1"
          size="small"
          onChange={(activeKey) => {
            if (activeKey === "in-this-board") {
              setTempBoardId(task.BoardId);
            }
          }}
        >
          <TabPane tab="In this board" key="in-this-board">
            {inThisBoard}
          </TabPane>
          <TabPane tab="Other board" key="other-board">
            {otherBoard}
          </TabPane>
        </Tabs>
      }
    >
      <Button size="small">Move Task</Button>
    </Popover>
  );
};
