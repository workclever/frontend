import { ColumnColor } from "@app/components/shared/ColumnColor";
import { useColumns } from "@app/hooks/useColumns";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { BoardGroupableKey } from "@app/types/Project";
import { GroupItem } from "@ozgurrgul/dragulax";
import { useSelector } from "react-redux";
import { ColumnMenu } from "../../ColumnMenu";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { useUser } from "@app/hooks/useUser";

type GroupProps = { group: GroupItem; groupId: number };

const ColumnId: React.FC<GroupProps> = ({ groupId }) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { columns } = useColumns(Number(selectedBoardId));
  const column = columns.find((r) => r.Id === groupId);

  if (!column) {
    return null;
  }

  return (
    <>
      <ColumnColor
        columnId={groupId}
        boardId={column.BoardId}
        style={{ marginRight: 8 }}
      />
      <div style={{ flex: 1 }}>{column.Name}</div>
      <span style={{ marginLeft: 4 }}>
        <ColumnMenu columnId={groupId} />
      </span>
    </>
  );
};

const ReporterId: React.FC<GroupProps> = ({ groupId: userId }) => {
  const user = useUser(userId);
  return (
    <>
      <UserAvatar userId={userId} />
      <span style={{ marginLeft: 8 }}>{user?.user?.FullName}</span>
    </>
  );
};

const GroupMap: {
  [groupKey in BoardGroupableKey]: React.FC<GroupProps>;
} = {
  ColumnId: ColumnId,
  ReporterUserId: ReporterId,
};

export const GroupName: React.FC<{
  groupBy: BoardGroupableKey;
  group: GroupItem;
  groupId: number;
}> = ({ groupBy, group, groupId }) => {
  const Component = GroupMap[groupBy];

  console.log({ groupId, group });

  if (!Component) {
    return null;
  }

  return <Component group={group} groupId={groupId} />;
};
