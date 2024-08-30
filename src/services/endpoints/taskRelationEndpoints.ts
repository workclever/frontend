import { BaseOutput } from "../../types/BaseOutput";
import { ListTaskRelationsOutput } from "../../types/Project";
import { Builder } from "../types";

export const taskRelationEndpoints = (builder: Builder) => ({
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
