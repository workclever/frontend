import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { TagTypesType } from "./tags";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Builder = EndpointBuilder<ReturnType<any>, TagTypesType, "api">;
