import React from "react";
import { ProjectType } from "../types/Project";
import { EntityClasses, Permissions } from "../types/Roles";
import { SiteSettings } from "../types/SiteSettings";
import { User } from "../types/User";

export type SiteContextType = {
  siteSettings?: SiteSettings;
  me?: User;
  accessedEntities: {
    EntityClass: EntityClasses;
    EntityId: number;
    Permission: Permissions;
  }[];
  userProjects: ProjectType[];
};

export const SiteContext = React.createContext<SiteContextType>({
  accessedEntities: [],
  userProjects: [],
});
