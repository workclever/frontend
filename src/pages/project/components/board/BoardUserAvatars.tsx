import { Avatar } from "antd";
import { uniq } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useProjectTasks } from "@app/hooks/useProjectTasks";
import {
  selectBoardFilters,
  selectSelectedBoardId,
  setBoardFilter,
} from "@app/slices/project/projectSlice";
import { UserAvatar } from "@app/components/shared/UserAvatar";

export const BoardUserAvatars = () => {
  const dispatch = useDispatch();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const tasks = useProjectTasks();
  const filteredUserIds = useSelector(selectBoardFilters).userIds || [];

  const tasksInBoard = Object.values(tasks).filter(
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
      <Avatar.Group max={{ popover: { trigger: "click" } }}>
        {userIds.map((userId) => (
          <UserAvatar
            key={userId}
            active={isActive(userId)}
            userId={userId}
            onClick={() => onUserClick(userId)}
          />
        ))}
      </Avatar.Group>
    </div>
  );
};
