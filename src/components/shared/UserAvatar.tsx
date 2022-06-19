import { Avatar } from "antd";
import { BACKEND_URL } from "../../constants";
import { useUser } from "../../hooks/useUser";
import { Tooltip } from "./primitives/Tooltip";

export const UserAvatar: React.FC<{
  userId: number;
  hideTooltip?: boolean;
  onClick?: () => void;
  active?: boolean;
}> = ({ userId, hideTooltip, onClick, active }) => {
  const { user } = useUser(userId);
  const avatarUrl = user?.AvatarUrl;
  const computedUrl = avatarUrl ? `${BACKEND_URL}${avatarUrl}` : undefined;

  const style: React.CSSProperties = {
    cursor: onClick ? "pointer" : "inherit",
    border: active ? "2px solid var(--purple11)" : "2px solid transparent",
  };

  const avatarItself = (
    <span onClick={onClick}>
      <Avatar src={computedUrl} style={style} size={20} alt={user?.FullName} />
    </span>
  );

  return hideTooltip ? (
    avatarItself
  ) : (
    <Tooltip title={user?.FullName}>{avatarItself}</Tooltip>
  );
};
