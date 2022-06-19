import { SiteContextType } from "../contexts/SiteContext";
import {
  useGetUserQuery,
  useListMyAccessedEntitiesQuery,
  useGetSiteSettingsQuery,
  useListUserProjectsQuery,
} from "../services/api";

export const useInitializeSiteContextValue = (): SiteContextType => {
  const { data: me, isLoading: meLoading } = useGetUserQuery(null);
  const skipRule = {
    skip: !me,
  };
  const { data: accessedEntities, isLoading: accessedEntitiesLoading } =
    useListMyAccessedEntitiesQuery(null, skipRule);
  const { data: siteSettings, isLoading: siteSettingsLoading } =
    useGetSiteSettingsQuery(null, skipRule);
  const { data: userProjects, isLoading: userProjectsLoading } =
    useListUserProjectsQuery(null, skipRule);
  return {
    me: me?.Data,
    accessedEntities: accessedEntities?.Data || [],
    userProjects: userProjects?.Data || [],
    siteSettings: siteSettings?.Data,
    initialized:
      !meLoading &&
      !accessedEntitiesLoading &&
      !siteSettingsLoading &&
      !userProjectsLoading,
  };
};
