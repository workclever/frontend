import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";

export const authEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  login: builder.mutation<
    BaseOutput<string>,
    {
      Email: string;
      Password: string;
    }
  >({
    query: (body) => ({
      url: "/Auth/Login",
      method: "POST",
      body,
    }),
  }),
  register: builder.mutation<
    BaseOutput<string>,
    {
      FullName: string;
      Email: string;
      Password: string;
    }
  >({
    query: (body) => ({
      url: "/Auth/Register",
      method: "POST",
      body,
    }),
  }),
});
