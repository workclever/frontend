import { BaseOutput } from "../../types/BaseOutput";
import { Builder } from "../types";

export const authEndpoints = (builder: Builder) => ({
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
