import { BaseOutput } from "../../types/BaseOutput";
import { BasicUserOutput, ProjectType } from "../../types/Project";
import { EntityClasses, UserEntityAccess } from "../../types/Roles";
import { Builder } from "../types";

export const projectEndpoints = (builder: Builder) => ({
  listProjectUsers: builder.query<BaseOutput<BasicUserOutput[]>, number>({
    query: (id) => ({ url: `/Project/ListProjectUsers?projectId=${id}` }),
  }),
  createProjectAssignee: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      Ids: { UserId: number }[];
    }
  >({
    query: (body) => ({
      url: "/Project/CreateProjectAssignee",
      method: "POST",
      body,
    }),
    invalidatesTags: ["UserAssignedProjectIds"],
  }),
  removeProjectAssignee: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      Ids: { UserId: number }[];
    }
  >({
    query: (body) => ({
      url: "/Project/RemoveProjectAssignee",
      method: "POST",
      body,
    }),
    invalidatesTags: ["UserAssignedProjectIds"],
  }),
  getProject: builder.query<BaseOutput<ProjectType>, number>({
    query: (id) => ({ url: `/Project/GetProject?projectId=${id}` }),
    providesTags: ["Project"],
  }),
  createProject: builder.mutation<
    BaseOutput<ProjectType>,
    {
      Slug: string;
      Name: string;
    }
  >({
    query: (body) => ({
      url: "/Project/CreateProject",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Project", "AccessedEntities"],
  }),
  updateProject: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      Name: string;
      Slug: string;
    }
  >({
    query: (body) => ({
      url: "/Project/UpdateProject",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Project"],
  }),
  deleteProject: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/Project/DeleteProject?projectId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Project"],
  }),
  ListProjectUserAccesses: builder.query<
    BaseOutput<UserEntityAccess[]>,
    { projectId: number; entityClass: EntityClasses }
  >({
    query: ({ projectId }) => ({
      url: `/Project/ListProjectUserAccesses?projectId=${projectId}`,
    }),
    providesTags: ["ProjectManagers"],
  }),
  createManagerUserForProject: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      UserId: number;
    }
  >({
    query: (body) => ({
      url: "/Project/CreateManagerUserForProject",
      method: "POST",
      body,
    }),
    invalidatesTags: ["ProjectManagers"],
  }),
  deleteManagerUserForProject: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      UserId: number;
    }
  >({
    query: (body) => ({
      url: "/Project/DeleteManagerUserForProject",
      method: "DELETE",
      body,
    }),
    invalidatesTags: ["ProjectManagers"],
  }),
});
