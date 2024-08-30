import { BaseOutput } from "../../types/BaseOutput";
import { SiteSettings } from "../../types/SiteSettings";
import { Builder } from "../types";

export const siteSettingsEndpoints = (builder: Builder) => ({
  getSiteSettings: builder.query<BaseOutput<SiteSettings>, null>({
    query: () => ({ url: "/SiteSettings/GetSiteSettings" }),
    providesTags: ["SiteSettings"],
  }),
  updateSiteSetting: builder.mutation<
    BaseOutput<string>,
    {
      Property: keyof SiteSettings;
      Value: string;
    }
  >({
    query: (body) => ({
      url: "/SiteSettings/updateSiteSetting",
      method: "POST",
      body,
    }),
    invalidatesTags: ["SiteSettings"],
  }),
});
