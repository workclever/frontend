import React from "react";
import { useSelector } from "react-redux";
import { useBoards } from "../../../../../hooks/useBoards";
import { useColumns } from "../../../../../hooks/useColumns";
import { useFormattedDateTime } from "../../../../../hooks/useFormattedDateTime";
import { useUser } from "../../../../../hooks/useUser";
import { useListTaskChangeLogQuery } from "../../../../../services/api";
import { selectSelectedBoardId } from "../../../../../slices/project/projectSlice";
import { TaskChangeLogType, TaskType } from "../../../../../types/Project";
import { UserAvatar } from "../../../../../components/shared/UserAvatar";
import { LoadingSpin } from "../../../../../components/shared/primitives/LoadingSpin";
import { Flex, Stack, xcss } from "@atlaskit/primitives";
import AtlasKitComment, { CommentTime } from "@atlaskit/comment";
import { Text } from "../../../../../components/shared/primitives/Text";

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
  if (Property === "AssigneeUserId") {
    return <ChangeLogUserId type="Assignee" item={item} />;
  }
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
    <AtlasKitComment
      avatar={user && <UserAvatar userId={user?.Id} />}
      author={<Text strong>{user?.FullName}</Text>}
      content={
        <Flex direction="row" gap="space.050">
          updated <ChangeLogValues item={item} />
        </Flex>
      }
      time={<CommentTime>{formattedDateTime}</CommentTime>}
    />
  );
};

export const TaskChangeLog: React.FC<Props> = ({ task }) => {
  const { data: changeLogs, isLoading } = useListTaskChangeLogQuery(task.Id);
  const changeLogsData = changeLogs?.Data || [];

  if (isLoading) {
    return <LoadingSpin />;
  }

  return (
    <Stack
      space="space.100"
      xcss={xcss({
        marginTop: "space.100",
        width: "100%",
      })}
    >
      {changeLogsData.map((item) => (
        <ChangeLogItem key={item.Id} item={item} />
      ))}
    </Stack>
  );
};
