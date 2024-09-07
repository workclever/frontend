import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { useTask } from "@app/hooks/useTask";
import { useUser } from "@app/hooks/useUser";
import { selectSelectedBoardId } from "@app/slices/project/projectSlice";
import { TaskChangeLogType } from "@app/types/Project";
import { useSelector } from "react-redux";

const ChangeLogUserId: React.FC<{
  item: TaskChangeLogType;
  type: string;
}> = ({ item, type }) => {
  const { user: oldUser } = useUser(Number(item.OldValue));
  const { user: newUser } = useUser(Number(item.NewValue));
  return (
    <>
      <span style={{ color: "#444444", fontWeight: "500" }}>{type}</span> from{" "}
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
      <span style={{ color: "#444444", fontWeight: "500" }}>board column</span>{" "}
      from <i>{oldColumn?.Name}</i> to <i>{newColumn?.Name}</i>
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
      <span style={{ color: "#444444", fontWeight: "500" }}>board</span> from{" "}
      <i>{oldBboard?.Name}</i> to <i>{newBoard?.Name}</i>
    </>
  );
};

const ChangeLogParentTaskItemId: React.FC<{
  item: TaskChangeLogType;
}> = ({ item }) => {
  const { task } = useTask(Number(item.NewValue));
  return (
    <>
      <span style={{ color: "#444444", fontWeight: "500" }}>parent task</span>{" "}
      to <i>{task?.Slug || item.NewValue}</i>
    </>
  );
};

const ChangeLogValues: React.FC<{ item: TaskChangeLogType }> = ({ item }) => {
  const { Property } = item;
  if (Property === "ReporterUserId") {
    return <ChangeLogUserId type="Reporter" item={item} />;
  }
  if (Property === "ParentTaskItemId") {
    return <ChangeLogParentTaskItemId item={item} />;
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

  if (Property === "Title") {
    return <>title to {item.NewValue}</>;
  }

  if (Property === "Description") {
    return <>description</>;
  }

  return (
    <>
      <span style={{ color: "#444444", fontWeight: "500" }}>
        {item.Property}
      </span>{" "}
      from <i>{item.OldValue}</i> to <i>{item.NewValue}</i>
    </>
  );
};

export const TaskChangeLog: React.FC<{ item: TaskChangeLogType }> = ({
  item,
}) => {
  const { user } = useUser(item.UserId);
  const formattedDateTime = useFormattedDateTime(item.DateCreated);
  return (
    <div>
      <div>
        <span style={{ color: "#444444", fontWeight: "500" }}>
          {user?.FullName}
        </span>{" "}
        updated <ChangeLogValues item={item} />
      </div>
      <i>{formattedDateTime} </i>
    </div>
  );
};
