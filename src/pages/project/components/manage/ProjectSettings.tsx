import { UserOutlined, LaptopOutlined } from "@ant-design/icons";
import { ProjectBoards } from "./ProjectBoards";
import { ProjectMeta } from "./ProjectMeta";
import { ProjectUsers } from "./ProjectUsers";
import {
  MasterDetail,
  MasterDetailMetaType,
} from "../../../../components/shared/MasterDetail";
import { CustomFieldList } from "./custom-field/CustomFieldList";

export const ProjectSettings = () => {
  const menuItems: MasterDetailMetaType[] = [
    {
      label: "Meta",
      icon: <LaptopOutlined />,
    },
    {
      label: "Boards",
      icon: <UserOutlined />,
    },
    {
      label: "Users",
      icon: <UserOutlined />,
    },
    {
      label: "Custom fields",
      icon: <UserOutlined />,
    },
  ];

  const components = {
    0: () => <ProjectMeta />,
    1: () => <ProjectBoards />,
    2: () => <ProjectUsers />,
    3: () => <CustomFieldList />,
  };

  return (
    <MasterDetail menuItems={menuItems} components={components} mode="tab" />
  );
};
