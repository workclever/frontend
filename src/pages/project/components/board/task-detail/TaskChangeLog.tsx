import { Timeline } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { useUser } from "@app/hooks/useUser";
import { useListTaskChangeLogQuery } from "@app/services/api";
import { selectSelectedBoardId } from "@app/slices/project/projectSlice";
import { TaskChangeLogType, TaskType } from "@app/types/Project";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";

type Props = {
  task: TaskType;
};

const ChangeLogUserId: React.FC<{
  item: TaskChangeLogType;
  type: string;
}> = ({ item, type }) => {
  const { user: oldUser } = useUser(Number(item.OldValue));
  const { user: newUser } = useUser(Number(item.NewValue));
  return (
    <>
      <strong>{type}</strong> from{" "}
      <i>{item.OldValue === "0" ? "Unassigned" : oldUser?.FullName}</i> to{" "}
      <i>{item.NewValue === "0" ? "Unassigned" : newUser?.FullName}</i>
    </>
  );
};

const ChangeLogColumnId: React.FC<{
  item: TaskChangeLogType;
}> = ({ item }) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { columns } = useColumns(Number(selectedBoardId));
  const oldColumn = columns.find((r) => r.Id === Number(item.OldValue));
  const newColumn = columns.find((r) => r.Id === Number(item.NewValue));
  return (
    <>
      <strong>board column</strong> from <i>{oldColumn?.Name}</i> to{" "}
      <i>{newColumn?.Name}</i>
    </>
  );
};

const ChangeLogBoardId: React.FC<{
  item: TaskChangeLogType;
}> = ({ item }) => {
  const boards = useBoards();
  const oldBboard = boards.find((r) => r.Id === Number(item.OldValue));
  const newBoard = boards.find((r) => r.Id === Number(item.NewValue));
  return (
    <>
      <strong>board</strong> from <i>{oldBboard?.Name}</i> to{" "}
      <i>{newBoard?.Name}</i>
    </>
  );
};

const ChangeLogValues: React.FC<{ item: TaskChangeLogType }> = ({ item }) => {
  const { Property } = item;
  if (Property === "ReporterUserId") {
    return <ChangeLogUserId type="Reporter" item={item} />;
  }
  // TODO changelog
  // if (Property === "AssigneeUserId") {
  //   return <ChangeLogUserId type="Assignee" item={item} />;
  // }
  if (Property === "ColumnId") {
    return <ChangeLogColumnId item={item} />;
  }
  if (Property === "BoardId") {
    return <ChangeLogBoardId item={item} />;
  }

  return (
    <>
      <strong>{item.Property}</strong> from <i>{item.OldValue}</i> to{" "}
      <i>{item.NewValue}</i>
    </>
  );
};

const ChangeLogItem: React.FC<{ item: TaskChangeLogType }> = ({ item }) => {
  const { user } = useUser(item.UserId);
  const formattedDateTime = useFormattedDateTime(item.DateCreated);
  return (
    <Timeline.Item>
      <div>
        {user && <UserAvatar userId={user?.Id} />}
        <strong>{user?.FullName}</strong> updated{" "}
        <ChangeLogValues item={item} />
      </div>
      <i>{formattedDateTime} </i>
    </Timeline.Item>
  );
};

export const TaskChangeLog: React.FC<Props> = ({ task }) => {
  const { data: changeLogs, isLoading } = useListTaskChangeLogQuery(task.Id);
  const changeLogsData = changeLogs?.Data || [];

  if (isLoading) {
    return <LoadingSpin />;
  }

  return (
    <Timeline>
      {changeLogsData.map((item) => (
        <ChangeLogItem key={item.Id} item={item} />
      ))}
    </Timeline>
  );
};
