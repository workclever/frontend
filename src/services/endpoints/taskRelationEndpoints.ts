import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import { ListTaskRelationsOutput } from "../../types/Project";

export const taskRelationEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  createTaskRelation: builder.mutation<
    BaseOutput<string>,
    {
      BaseTaskId: number;
      TargetTaskId: number;
      RelationTypeDefId: number;
    }
  >({
    query: (body) => ({
      url: `/TaskRelation/CreateTaskRelation`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskRelation"],
  }),
  updateTaskRelation: builder.mutation<
    BaseOutput<string>,
    {
      TaskParentRelationId: number;
      RelationTypeDefId: number;
    }
  >({
    query: (body) => ({
      url: `/TaskRelation/UpdateTaskRelation`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskRelation"],
  }),
  listTaskRelations: builder.query<ListTaskRelationsOutput, number>({
    query: (id) => ({ url: `/TaskRelation/ListTaskRelations?taskId=${id}` }),
    providesTags: ["TaskRelation"],
  }),
  deleteTaskRelation: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/TaskRelation/DeleteTaskRelation?taskParentRelationId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["TaskRelation"],
  }),
});
