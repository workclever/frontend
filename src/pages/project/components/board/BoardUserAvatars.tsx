import { uniq } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useProjectTasks } from "@app/hooks/useProjectTasks";
import {
  selectBoardFilters,
  selectSelectedBoardId,
  setBoardFilter,
} from "@app/slices/board/boardSlice";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { AvatarGroup } from "@app/components/shared/primitives/Avatar";

export const BoardUserAvatars = () => {
  const dispatch = useDispatch();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const { tasks } = useProjectTasks();
  const filteredUserIds = useSelector(selectBoardFilters).userIds || [];

  const tasksInBoard = (tasks || []).filter(
    (r) => r.BoardId === selectedBoardId
  );
  const reporterIds = tasksInBoard.map((r) => r.ReporterUserId);
  const assignedIds = tasksInBoard.map((r) => r.AssigneeUserIds).flat();
  const userIds = uniq([...reporterIds, ...assignedIds]).filter((r) => !!r);

  const onUserClick = (userId: number) => {
    let newFilteredUserIds = filteredUserIds || [];

    if (newFilteredUserIds.indexOf(userId) > -1) {
      newFilteredUserIds = newFilteredUserIds.filter((r) => userId !== r);
    } else {
      newFilteredUserIds = [...newFilteredUserIds, userId];
    }
    dispatch(
      setBoardFilter({
        key: "userIds",
        value: newFilteredUserIds,
      })
    );
  };

  const isActive = (userId: number) => {
    return (filteredUserIds || []).indexOf(userId) > -1;
  };

  if (userIds.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: 4, fontSize: 12 }}>Filter by users:</div>
      <AvatarGroup maxVisible={15}>
        {userIds.map((userId) => (
          <UserAvatar
            key={userId}
            active={isActive(userId)}
            userId={userId}
            onClick={() => onUserClick(userId)}
          />
        ))}
      </AvatarGroup>
    </div>
  );
};
