import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { EnhancedDropdownMenu } from "../components/shared/EnhancedDropdownMenu";
import { Button } from "../components/shared/primitives/Button";
import { Modal } from "../components/shared/primitives/Modal";
import { Space } from "../components/shared/primitives/Space";
import { UserAvatar } from "../components/shared/UserAvatar";
import { useMe } from "../hooks/useMe";
import { Me } from "../components/user/Me";
import { useGetUnreadNotificationsCountQuery } from "../services/api";
import { logout } from "../slices/auth/authSlice";
import Badge from "antd/lib/badge";
import { NotificationOutlined } from "@ant-design/icons";
import { useAppNavigate } from "../hooks/useAppNavigate";

export const LayoutRightContent = () => {
  const { me, isAdmin } = useMe();
  const userId = me?.Id as number;
  const dispatch = useDispatch();
  const { goToNotifications } = useAppNavigate();
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
      <Space>
        {isAdmin && (
          <Link to="/manage">
            <Button>Admin</Button>
          </Link>
        )}
        <Space size="large">
          <span onClick={goToNotifications}>
            <Badge count={unreadNotificationsCount?.Data}>
              <NotificationOutlined />
            </Badge>
          </span>
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
        </Space>
      </Space>
      <Modal
        visible={userSettingsModalVisible}
        onCancel={() => setUserSettingsModalVisible(false)}
        title="Account"
      >
        <div style={{ padding: 8 }}>
          <Me />
        </div>
      </Modal>
    </>
  );
};
