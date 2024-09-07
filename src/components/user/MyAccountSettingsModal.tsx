import { CircleUserIcon, ShieldAlertIcon } from "lucide-react";
import { SettingsModal } from "../shared/SettingsModal";
import { Account } from "./Account";
import { ChangePassword } from "./ChangePassword";

export const MyAccountSettingsModal: React.FC<{ onCancel: () => void }> = ({
  onCancel,
}) => {
  return (
    <SettingsModal
      onCancel={onCancel}
      items={[
        {
          name: "Account",
          icon: <CircleUserIcon size={15} />,
          element: <Account />,
        },
        {
          name: "Security",
          icon: <ShieldAlertIcon size={15} />,
          element: <ChangePassword />,
        },
      ]}
    />
  );
};
