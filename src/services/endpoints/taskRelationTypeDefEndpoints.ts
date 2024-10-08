import { BaseOutput } from "../../types/BaseOutput";
import { TaskRelationTypeDef } from "../../types/TaskRelationTypeDef";
import { Builder } from "../types";

export const taskRelationTypeDefEndpoints = (builder: Builder) => ({
  listTaskRelationTypeDefs: builder.query<
    BaseOutput<TaskRelationTypeDef[]>,
    null
  >({
    query: () => ({ url: `/TaskRelationTypeDef/ListTaskRelationTypeDefs` }),
    providesTags: ["TaskRelationTypeDef"],
  }),
  createTaskRelationTypeDef: builder.mutation<
    BaseOutput<string>,
    {
      Type: string;
      InwardOperationName: string;
      OutwardOperationName: string;
    }
  >({
    query: (body) => ({
      url: "/TaskRelationTypeDef/CreateTaskRelationTypeDef",
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskRelationTypeDef"],
  }),
  updateTaskRelationTypeDef: builder.mutation<
    BaseOutput<string>,
    {
      Id: number;
      Type: string;
      InwardOperationName: string;
      OutwardOperationName: string;
    }
  >({
    query: (body) => ({
      url: "/TaskRelationTypeDef/UpdateTaskRelationTypeDef",
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskRelationTypeDef"],
  }),
  deleteTaskRelationTypeDef: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/TaskRelationTypeDef/DeleteTaskRelationTypeDef?taskRelationTypeDefId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["TaskRelationTypeDef"],
  }),
});
