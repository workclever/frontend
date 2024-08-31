import AtlasKitAvatar from "@atlaskit/avatar";
import { BACKEND_URL } from "../../constants";
import { useUser } from "../../hooks/useUser";
import { Tooltip } from "./primitives/Tooltip";
import { blue, magenta } from "@ant-design/colors";

// TODO create initials of avatar
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
    backgroundColor: magenta[3],
  };

  if (active) {
    style.border = `2px solid ${blue[4]}`;
  }

  const avatarItself = (
    <span onClick={onClick}>
      <AtlasKitAvatar
        src={computedUrl}
        borderColor={active ? "blue" : "inherit"}
        size="small"
        name={user?.FullName}
      />
    </span>
  );

  return hideTooltip ? (
    avatarItself
  ) : (
    <Tooltip title={user?.FullName}>{avatarItself}</Tooltip>
  );
};
