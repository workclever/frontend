import { LaptopOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import {
  MasterDetail,
  MasterDetailMetaType,
} from "../../components/shared/MasterDetail";
import { Role } from "../../components/shared/Role";
import { LayoutWithHeader } from "../../layout/LayoutWithHeader";
import { LoggedInLayout } from "../../layout/LoggedInLayout";
import { Roles } from "../../types/Roles";
import { EditSiteSettings } from "./components/EditSiteSettings";
import { RelationshipTypeDefinitions } from "./components/RelationshipTypeDefinitions";
import { Users } from "./components/Users";

export const GlobalSettingsPage = () => {
  const menuItems: MasterDetailMetaType[] = [
    {
      label: "Site Settings",
      icon: <LaptopOutlined />,
    },
    {
      label: "Relationship Definitions",
      icon: <LaptopOutlined />,
    },
    {
      label: "Users",
      icon: <UsergroupAddOutlined />,
    },
  ];

  const components = {
    0: () => <EditSiteSettings />,
    1: () => <RelationshipTypeDefinitions />,
    2: () => <Users />,
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
