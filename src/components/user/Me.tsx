import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { MasterDetail, MasterDetailMetaType } from "../shared/MasterDetail";
import { Account } from "./Account";
import { ChangePassword } from "./ChangePassword";

export const Me = () => {
  const menuItems: MasterDetailMetaType[] = [
    {
      label: "Account",
      icon: <UserOutlined />,
    },
    {
      label: "Password",
      icon: <KeyOutlined />,
    },
  ];
  const components = {
    0: () => <Account />,
    1: () => <ChangePassword />,
  };

  return (
    <MasterDetail menuItems={menuItems} components={components} mode="tab" />
  );
};
