import { SiteContextType } from "../contexts/SiteContext";
import {
  useGetUserQuery,
  useListMyAccessedEntitiesQuery,
  useGetSiteSettingsQuery,
  useListUserProjectsQuery,
} from "../services/api";

export const useInitializeSiteContextValue = (): SiteContextType => {
  const { data: me } = useGetUserQuery(null);
  const skipRule = {
    skip: !me,
  };
  const { data: accessedEntities } = useListMyAccessedEntitiesQuery(
    null,
    skipRule
  );
  const { data: siteSettings } = useGetSiteSettingsQuery(null, skipRule);
  const { data: userProjects } = useListUserProjectsQuery(null, skipRule);
  return {
    me: me?.Data,
    accessedEntities: accessedEntities?.Data || [],
    userProjects: userProjects?.Data || [],
    siteSettings: siteSettings?.Data,
  };
};
