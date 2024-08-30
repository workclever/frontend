import { MenuProps } from "antd/lib/menu";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { MasterDetail } from "../shared/MasterDetail";
import { Account } from "./Account";
import { ChangePassword } from "./ChangePassword";

export const Me = () => {
  const menuItems: MenuProps["items"] = [
    {
      label: "Account",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Password",
      key: "2",
      icon: <KeyOutlined />,
    },
  ];
  const components = {
    1: () => <Account />,
    2: () => <ChangePassword />,
  };

  return (
    <MasterDetail menuItems={menuItems} components={components} mode="tab" />
  );
};
