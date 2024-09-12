/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnColor } from "@app/components/shared/ColumnColor";
import { useColumns } from "@app/hooks/useColumns";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { BoardGroupableKey } from "@app/types/Project";
import { GroupItem } from "@ozgurrgul/dragulax";
import { useSelector } from "react-redux";
import { ColumnMenu } from "../../ColumnMenu";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { useUser } from "@app/hooks/useUser";
import { CUSTOM_FIELD_PREFIX } from "./constants";
import { GroupNameCustomField } from "./GroupNameCustomField";

type GroupProps = { group: GroupItem };

const ColumnId: React.FC<GroupProps> = ({ group }) => {
  const columnId = (group.data as any)?.groupValues as number;
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { columns } = useColumns(Number(selectedBoardId));
  const column = columns.find((r) => r.Id === columnId);

  if (!column) {
    return null;
  }

  return (
    <>
      <ColumnColor
        columnId={columnId}
        boardId={column.BoardId}
        style={{ marginRight: 8 }}
      />
      <div style={{ flex: 1 }}>{column.Name}</div>
      <span style={{ marginLeft: 4 }}>
        <ColumnMenu columnId={columnId} />
      </span>
    </>
  );
};

const ReporterUserId: React.FC<GroupProps> = ({ group }) => {
  const userId = (group.data as any)?.groupValues as number;
  const user = useUser(userId);
  return (
    <>
      <UserAvatar userId={userId} />
      <span style={{ marginLeft: 8 }}>{user?.user?.FullName}</span>
    </>
  );
};

const StaticGroupMap: {
  [groupKey in BoardGroupableKey]: React.FC<GroupProps>;
} = {
  ColumnId: ColumnId,
  ReporterUserId: ReporterUserId,
};

export const GroupName: React.FC<{
  groupBy: BoardGroupableKey;
  group: GroupItem;
}> = ({ groupBy, group }) => {
  if (groupBy.startsWith(CUSTOM_FIELD_PREFIX)) {
    const customFieldId = Number(groupBy.split(CUSTOM_FIELD_PREFIX)[1]);
    if (!customFieldId) {
      return null;
    }
    return <GroupNameCustomField group={group} customFieldId={customFieldId} />;
  }
  const Component = StaticGroupMap[groupBy];
  if (!Component) {
    return null;
  }

  return <Component group={group} />;
};
