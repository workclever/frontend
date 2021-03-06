import { Avatar } from "antd";
import { uniq } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useProjectTasks } from "../../../../hooks/useProjectTasks";
import {
  selectBoardFilters,
  selectSelectedBoardId,
  setBoardFilter,
} from "../../../../slices/projectSlice";
import { UserAvatar } from "../../../../components/shared/UserAvatar";

export const BoardUserAvatars = () => {
  const dispatch = useDispatch();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const tasks = useProjectTasks();
  const filteredUserIds = useSelector(selectBoardFilters).userIds || [];

  const tasksInBoard = Object.values(tasks).filter(
    (r) => r.BoardId === selectedBoardId
  );
  const reporterIds = tasksInBoard.map((r) => r.ReporterUserId);
  const assignedIds = tasksInBoard.map((r) => r.AssigneeUserId);
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

  return (
    <Avatar.Group maxPopoverTrigger="click">
      {userIds.map((userId) => (
        <UserAvatar
          key={userId}
          active={isActive(userId)}
          userId={userId}
          onClick={() => onUserClick(userId)}
        />
      ))}
    </Avatar.Group>
  );
};
