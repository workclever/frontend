import React from "react";
import { useBoards } from "../../../../hooks/useBoards";
import { TaskType } from "../../../../types/Project";
import styled from "styled-components";
import { useColumns } from "../../../../hooks/useColumns";
import { useMoveTaskToColumnMutation } from "../../../../services/api";
import { useTaskUpdateProperty } from "../../../../hooks/useTaskUpdateProperty";
import { optimisticUpdateDependOnApi } from "../../../../hooks/optimisticUpdateDependOnApi";
import { HttpResult } from "../../../../components/shared/HttpResult";
import { Popover } from "../../../../components/shared/primitives/Popover";
import { Button } from "../../../../components/shared/primitives/Button";
import { Space } from "../../../../components/shared/primitives/Space";
import AtlasKitSelect from "@atlaskit/select";

const SelectTitle = styled.div`
  font-weight: bold;
`;

type Props = {
  task: TaskType;
};

export const TaskMover: React.FC<Props> = ({ task }) => {
  // const selectedProjectId = useSelector(selectSelectedProjectId);
  const [tempBoardId, setTempBoardId] = React.useState<number>(task.BoardId);
  const [tempColumnId, setTempColumnId] = React.useState<number>(task.ColumnId);
  const boards = useBoards();
  const { columns } = useColumns(tempBoardId);

  const [moveTask, { isLoading: isMoving, error, data }] =
    useMoveTaskToColumnMutation();
  const { updateStateOnly } = useTaskUpdateProperty(task);
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
    optimisticUpdateDependOnApi(
      () =>
        moveTask({
          TargetBoardId: tempBoardId,
          TargetColumnId: tempColumnId,
          TaskId: task.Id,
        }),
      () =>
        updateStateOnly({
          property: "BoardId",
          value: tempBoardId,
        }),
      () =>
        updateStateOnly({
          property: "ColumnId",
          value: tempColumnId,
        })
    );
  };

  const content = (
    <Space direction="vertical">
      <div>
        <SelectTitle>Board</SelectTitle>
        <AtlasKitSelect
          styles={{ container: (base) => ({ ...base, width: "200px" }) }}
          placeholder="Board"
          value={{
            value: tempBoardId,
            label: boards.find((r) => r.Id === tempBoardId)?.Name,
          }}
          onChange={(value) => setTempBoardId(Number(value?.value))}
          isClearable
          options={boards.map((r) => {
            return {
              label: r.Name,
              value: r.Id,
            };
          })}
        />
      </div>
      <div>
        <SelectTitle>Column</SelectTitle>
        <AtlasKitSelect
          styles={{ container: (base) => ({ ...base, width: "200px" }) }}
          placeholder="Column"
          value={{
            value: tempColumnId,
            label: columns.find((r) => r.Id === tempBoardId)?.Name,
          }}
          onChange={(value) => setTempColumnId(Number(value?.value))}
          isClearable
          disabled={hasNoColumns}
          options={columns.map((r) => {
            return {
              label: r.Name,
              value: r.Id,
            };
          })}
        />
      </div>
      <Button
        isDisabled={hasNoColumns || isMoving}
        // TODOAK  style={{ marginTop: 4 }}
        onClick={onMoveButtonClick}
        isLoading={isMoving}
      >
        Move
      </Button>
      <HttpResult error={error} result={data} style={{ marginTop: 4 }} />
    </Space>
  );

  return (
    <Popover content={content}>
      <Button>Move Task</Button>
    </Popover>
  );
};
