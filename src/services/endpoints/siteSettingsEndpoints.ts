import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import { SiteSettings } from "../../types/SiteSettings";

export const siteSettingsEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
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
