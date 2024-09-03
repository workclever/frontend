import { UserOutlined, LaptopOutlined } from "@ant-design/icons";
import { ProjectBoards } from "./ProjectBoards";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectUsers } from "./ProjectUsers";
import { MasterDetail } from "@app/components/shared/MasterDetail";
import { CustomFieldList } from "./custom-field/CustomFieldList";
import { MenuProps } from "antd/lib/menu";

export const ProjectSettings = () => {
  const menuItems: MenuProps["items"] = [
    {
      label: "Meta",
      key: "meta",
      icon: <LaptopOutlined />,
    },
    {
      label: "Boards",
      key: "boards",
      icon: <UserOutlined />,
    },
    {
      label: "Users",
      key: "users",
      icon: <UserOutlined />,
    },
    {
      label: "Custom fields",
      key: "fields",
      icon: <UserOutlined />,
    },
  ];

  const components = {
    meta: () => <ProjectMeta />,
    users: () => <ProjectUsers />,
    boards: () => <ProjectBoards />,
    fields: () => <CustomFieldList />,
  };

  return (
    <MasterDetail menuItems={menuItems} components={components} mode="tab" />
  );
};
