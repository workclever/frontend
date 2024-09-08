import { Badge } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { EnhancedDropdownMenu } from "../components/shared/EnhancedDropdownMenu";
import { Button } from "../components/shared/primitives/Button";
import { UserAvatar } from "../components/shared/UserAvatar";
import { UserNotifications } from "../components/user/UserNotifications";
import { useMe } from "../hooks/useMe";
import { useGetUnreadNotificationsCountQuery } from "../services/api";
import { logout } from "../slices/auth/authSlice";
import { MyAccountSettingsModal } from "@app/components/user/MyAccountSettingsModal";
import { BellIcon, ShieldPlusIcon } from "lucide-react";
import { Popover } from "@app/components/shared/primitives/Popover";

export const HeaderRightContent = () => {
  const { me, isAdmin } = useMe();
  const userId = me?.Id as number;
  const dispatch = useDispatch();
  const onLogoutClick = () => {
    dispatch(logout());
    document.location.href = "/login";
  };

  const { data: unreadNotificationsCount } =
    useGetUnreadNotificationsCountQuery(null, { pollingInterval: 1000 * 30 });

  const [userSettingsModalVisible, setUserSettingsModalVisible] =
    React.useState(false);

  return (
    <>
      {isAdmin && (
        <span>
          <Link to="/manage">
            <Button type="text" size="small">
              <ShieldPlusIcon size={15} />
              Manage site
            </Button>
          </Link>
        </span>
      )}
      <Popover content={<UserNotifications />} placement="bottomRight">
        <Button style={{ cursor: "pointer" }} type="text" size="small">
          <Badge count={unreadNotificationsCount?.Data}>
            <BellIcon size={15} />
          </Badge>
        </Button>
      </Popover>
      <EnhancedDropdownMenu
        triggerElement={
          <span style={{ cursor: "pointer" }}>
            <UserAvatar hideTooltip userId={userId} />
          </span>
        }
        items={[
          {
            key: "1",
            label: "Account settings",
            onClick: () => setUserSettingsModalVisible(true),
          },

          {
            key: "2",
            label: "Logout",
            onClick: onLogoutClick,
          },
        ]}
      />
      {userSettingsModalVisible && (
        <MyAccountSettingsModal
          onCancel={() => setUserSettingsModalVisible(false)}
        />
      )}
    </>
  );
};
