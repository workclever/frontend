import { LoggedInLayout } from "../../layout/LoggedInLayout";
import { UserNotifications } from "../../components/user/UserNotifications";
import { LayoutWithHeader } from "../../layout/LayoutWithHeader";

export const NotificationsPage = () => {
  return (
    <LoggedInLayout>
      <LayoutWithHeader
        title="My notifications"
        subTitle="See your notifications"
      >
        <UserNotifications showAll />
      </LayoutWithHeader>
    </LoggedInLayout>
  );
};
