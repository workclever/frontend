import { BaseOutput } from "../../types/BaseOutput";
import { BasicUserOutput, ListUserProjectsOutput } from "../../types/Project";
import { EntityClasses, Permissions } from "../../types/Roles";
import { GetUserOutput } from "../../types/User";
import { Builder } from "../types";

export const userEndpoints = (builder: Builder) => ({
  getUser: builder.query<GetUserOutput, null>({
    query: () => ({ url: "/User/GetUser" }),
    providesTags: ["GetUser"],
  }),
  listUserProjects: builder.query<ListUserProjectsOutput, null>({
    query: () => ({ url: "/User/ListUserProjects" }),
    providesTags: ["Project"],
  }),
  listAllUsers: builder.query<BaseOutput<BasicUserOutput[]>, null>({
    query: () => ({ url: "/User/ListAllUsers" }),
    providesTags: ["User"],
  }),
  updateUser: builder.mutation<
    BaseOutput<string>,
    {
      UserId: number;
      FullName: string;
    }
  >({
    query: (body) => ({
      url: "/User/UpdateUser",
      method: "POST",
      body,
    }),
    invalidatesTags: ["User", "GetUser"],
  }),
  updateUserPreference: builder.mutation<
    BaseOutput<string>,
    {
      Property: keyof GetUserOutput["Data"]["Preferences"];
      Value: string;
    }
  >({
    query: (body) => ({
      url: "/User/UpdateUserPreference",
      method: "POST",
      body,
    }),
    invalidatesTags: ["GetUser"],
  }),
  createUser: builder.mutation<
    BaseOutput<string>,
    {
      Email: string;
      FullName: string;
      Password: string;
    }
  >({
    query: (body) => ({
      url: "/User/CreateUser",
      method: "POST",
      body,
    }),
    invalidatesTags: ["User"],
  }),
  getUserRoles: builder.query<BaseOutput<string[]>, number>({
    query: (id) => ({ url: `/User/GetUserRoles?userId=${id}` }),
    providesTags: ["UserRole"],
  }),
  getUserAssignedProjectIds: builder.query<BaseOutput<number[]>, number>({
    query: (id) => ({ url: `/User/GetUserAssignedProjectIds?userId=${id}` }),
    providesTags: ["UserAssignedProjectIds"],
  }),
  getAllRoles: builder.query<
    BaseOutput<
      {
        Id: number;
        Name: string;
      }[]
    >,
    null
  >({
    query: () => ({ url: `/User/GetAllRoles` }),
  }),
  addUserToRoles: builder.mutation<
    BaseOutput<string>,
    {
      UserId: number;
      Roles: string[];
    }
  >({
    query: (body) => ({
      url: "/User/AddUserToRoles",
      method: "POST",
      body,
    }),
    invalidatesTags: ["UserRole"],
  }),
  listMyAccessedEntities: builder.query<
    BaseOutput<
      {
        EntityClass: EntityClasses;
        EntityId: number;
        Permission: Permissions;
      }[]
    >,
    null
  >({
    query: () => ({
      url: `/User/ListMyAccessedEntities`,
    }),
    providesTags: ["AccessedEntities"],
  }),
  changePassword: builder.mutation<
    BaseOutput<string>,
    {
      OldPassword: string;
      NewPassword: string;
    }
  >({
    query: (body) => ({
      url: "/User/ChangePassword",
      method: "POST",
      body,
    }),
  }),
});
