import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { useTask } from "@app/hooks/useTask";
import { useUser } from "@app/hooks/useUser";
import { selectSelectedBoardId } from "@app/slices/project/projectSlice";
import { TaskChangeLogType } from "@app/types/Project";
import { useSelector } from "react-redux";
import styled from "styled-components";

type Props = {
  item: TaskChangeLogType;
};

const Wrapper = styled.span`
  font-size: 12px;
  display: flex;
  gap: 4px;
`;

const Bold = styled.span`
  font-weight: 600;
  color: #555555;
`;

const ChangeLogColumnId: React.FC<Props> = ({ item }) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { columns } = useColumns(Number(selectedBoardId));
  const newColumn = columns.find((r) => r.Id === Number(item.NewValue));
  return (
    <BaseChangeLog item={item}>
      updated <Bold>column</Bold> to <Bold>{newColumn?.Name}</Bold>
    </BaseChangeLog>
  );
};

const ChangeLogBoardId: React.FC<Props> = ({ item }) => {
  const boards = useBoards();
  const newBoard = boards.find((r) => r.Id === Number(item.NewValue));
  return (
    <BaseChangeLog item={item}>
      updated <Bold>board</Bold> to <Bold>{newBoard?.Name}</Bold>
    </BaseChangeLog>
  );
};

const ChangeLogParentTaskItemId: React.FC<Props> = ({ item }) => {
  const newParentTaskId = Number(item.NewValue);
  const { task } = useTask(newParentTaskId);
  const { goToTask } = useAppNavigate();

  if (!newParentTaskId) {
    return (
      <BaseChangeLog item={item}>
        removed <Bold>parent task</Bold>
      </BaseChangeLog>
    );
  }

  return (
    <BaseChangeLog item={item}>
      updated <Bold>parent task</Bold> to{" "}
      <Tooltip title={task?.Title}>
        <Bold
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (task) {
              goToTask(task);
            }
          }}
        >
          {task?.Slug || item.NewValue}
        </Bold>
      </Tooltip>
    </BaseChangeLog>
  );
};

const ChangeLogTitle: React.FC<Props> = ({ item }) => {
  return (
    <BaseChangeLog item={item}>
      updated <Bold>title</Bold> to <Bold>{item.NewValue}</Bold>
    </BaseChangeLog>
  );
};

const ChangeLogDescription: React.FC<Props> = ({ item }) => {
  return (
    <BaseChangeLog item={item}>
      updated <Bold>description</Bold>
    </BaseChangeLog>
  );
};

const ChangeLogAssignee: React.FC<Props> = ({ item }) => {
  const { user } = useUser(Number(item.NewValue));
  return (
    <BaseChangeLog item={item}>
      assigned to <Bold>{user?.FullName}</Bold>
    </BaseChangeLog>
  );
};

const ChangeLogUnassignee: React.FC<Props> = ({ item }) => {
  const { user } = useUser(Number(item.OldValue));
  return (
    <BaseChangeLog item={item}>
      unassigned from <Bold>{user?.FullName}</Bold>
    </BaseChangeLog>
  );
};

const BaseChangeLog: React.FC<
  Props & {
    children: React.ReactNode;
  }
> = ({ item, children }) => {
  const formattedDateTime = useFormattedDateTime(item.DateCreated);
  const { user } = useUser(item.UserId);
  return (
    <Wrapper>
      <Bold>{user?.FullName}</Bold>
      {children}
      <span style={{ color: "#00000073", fontSize: 10 }}>
        {formattedDateTime}{" "}
      </span>
    </Wrapper>
  );
};

const ComponentsPerChangeLogType: {
  [key in TaskChangeLogType["Property"]]: React.FC<Props> | undefined;
} = {
  BoardId: ChangeLogBoardId,
  ColumnId: ChangeLogColumnId,
  Title: ChangeLogTitle,
  Description: ChangeLogDescription,
  ParentTaskItemId: ChangeLogParentTaskItemId,
  TASK_ASSIGNED: ChangeLogAssignee,
  TASK_UNASSIGNED: ChangeLogUnassignee,
};

export const TaskChangeLog: React.FC<Props> = ({ item }) => {
  const Component = ComponentsPerChangeLogType[item.Property];
  if (!Component) {
    console.warn("Non-implemented TaskChangeLog for:", item.Property);
    return null;
  }
  return <div>{Component && <Component item={item} />}</div>;
};
