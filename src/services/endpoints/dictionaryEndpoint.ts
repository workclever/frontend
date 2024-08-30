import { BaseOutput } from "../../types/BaseOutput";
import { Builder } from "../types";

export const dictionaryEndpoints = (builder: Builder) => ({
  GetTimeZones: builder.query<BaseOutput<string[]>, null>({
    query: () => ({ url: `/Dictionary/GetTimeZones?` }),
  }),
});
