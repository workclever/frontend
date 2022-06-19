import { LaptopOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { MasterDetail } from "../../components/shared/MasterDetail";
import { Role } from "../../components/shared/Role";
import { LayoutWithHeader } from "../../layout/LayoutWithHeader";
import { LoggedInLayout } from "../../layout/LoggedInLayout";
import { Roles } from "../../types/Roles";
import { EditSiteSettings } from "./components/EditSiteSettings";
import { RelationshipTypeDefinitions } from "./components/RelationshipTypeDefinitions";
import { Users } from "./components/Users";

export const GlobalSettingsPage = () => {
  const menuItems: any = [
    {
      label: "Site Settings",
      key: "site-settings",
      icon: <LaptopOutlined />,
    },
    {
      label: "Relationship Definitions",
      key: "relationship-defs",
      icon: <LaptopOutlined />,
    },
    {
      label: "Users",
      key: "users",
      icon: <UsergroupAddOutlined />,
    },
  ];

  const components = {
    "site-settings": () => <EditSiteSettings />,
    "relationship-defs": () => <RelationshipTypeDefinitions />,
    users: () => <Users />,
  };

  return (
    <LoggedInLayout>
      <Role role={Roles.Admin} showWarning={true}>
        <LayoutWithHeader title="Management" subTitle="Site management">
          <MasterDetail
            menuItems={menuItems}
            components={components}
            mode="menu"
          />
        </LayoutWithHeader>
      </Role>
    </LoggedInLayout>
  );
};
