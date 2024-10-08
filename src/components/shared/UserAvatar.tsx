import { Avatar } from "./primitives/Avatar";
import { BACKEND_URL } from "../../constants";
import { useUser } from "../../hooks/useUser";
import { Tooltip } from "./primitives/Tooltip";
import { blue, gray } from "@ant-design/colors";

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
    backgroundColor: gray[1],
  };

  if (active) {
    style.border = `2px solid ${blue[3]}`;
  }

  const avatarItself = (
    <span onClick={onClick}>
      <Avatar
        src={computedUrl}
        style={style}
        alt={user?.FullName}
        initials={user?.FullName?.charAt(0)}
      />
    </span>
  );

  return hideTooltip ? (
    avatarItself
  ) : (
    <Tooltip title={user?.FullName}>{avatarItself}</Tooltip>
  );
};
