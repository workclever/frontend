import { Role } from "../../components/shared/Role";
import { LayoutWithHeader } from "../../layout/LayoutWithHeader";
import { LoggedInLayout } from "../../layout/LoggedInLayout";
import { Roles } from "../../types/Roles";
import { EditSiteSettings } from "./components/EditSiteSettings";
import { RelationshipTypeDefinitions } from "./components/RelationshipTypeDefinitions";
import { Users } from "./components/Users";
import { Settings } from "@app/components/shared/Settings";
import { IterationCcwIcon, SettingsIcon, UsersIcon } from "lucide-react";

export const GlobalSettingsPage = () => {
  return (
    <LoggedInLayout>
      <Role role={Roles.Admin} showWarning={true}>
        <LayoutWithHeader title="Management" subTitle="Site management">
          <Settings
            containerType="page"
            items={[
              {
                name: "Site settings",
                element: <EditSiteSettings />,
                icon: <SettingsIcon size={15} />,
              },
              {
                name: "Relationship Definitions",
                element: <RelationshipTypeDefinitions />,
                icon: <IterationCcwIcon size={15} />,
              },
              {
                name: "Users",
                element: <Users />,
                icon: <UsersIcon size={15} />,
              },
            ]}
          />
        </LayoutWithHeader>
      </Role>
    </LoggedInLayout>
  );
};
