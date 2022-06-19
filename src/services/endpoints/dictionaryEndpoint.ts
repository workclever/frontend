import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";

export const dictionaryEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  GetTimeZones: builder.query<BaseOutput<string[]>, null>({
    query: () => ({ url: `/Dictionary/GetTimeZones?` }),
  }),
});
