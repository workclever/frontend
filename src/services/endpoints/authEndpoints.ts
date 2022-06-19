import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  LoginOutput,
  LoginInput,
  RegisterOutput,
  RegisterInput,
} from "../../types/Auth";

export const authEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  login: builder.mutation<LoginOutput, LoginInput>({
    query: (body) => ({
      url: "/Auth/Login",
      method: "POST",
      body,
    }),
  }),
  register: builder.mutation<RegisterOutput, RegisterInput>({
    query: (body) => ({
      url: "/Auth/Register",
      method: "POST",
      body,
    }),
  }),
});
