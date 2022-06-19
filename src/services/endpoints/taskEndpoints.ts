import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import {
  UpdateTaskPropertyInput,
  ListTaskChangeLogOutput,
  TaskType,
  TaskAttachmentType,
} from "../../types/Project";

export const taskEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  listProjectTasks: builder.query<BaseOutput<TaskType[]>, number>({
    query: (id) => ({ url: `/Task/ListProjectTasks?projectId=${id}` }),
    providesTags: ["Task"],
  }),
  searchTasks: builder.mutation<
    BaseOutput<TaskType[]>,
    { text: string; ProjectId: number }
  >({
    query: ({ text, ProjectId }) => ({
      url: `/Task/SearchTasks?text=${text}&projectId=${ProjectId}`,
    }),
  }),
  listTaskChangeLog: builder.query<ListTaskChangeLogOutput, number>({
    query: (id) => ({ url: `/Task/ListTaskChangeLog?taskId=${id}` }),
    providesTags: ["ChangeLog"],
  }),
  moveTaskToColumn: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      TargetBoardId: number;
      TargetColumnId: number;
    }
  >({
    query: (body) => ({
      url: "/Task/MoveTaskToColumn",
      method: "POST",
      body,
    }),
  }),
  updateTaskAssigneeUser: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      UserId: number;
    }
  >({
    query: (body) => ({
      url: "/Task/UpdateTaskAssigneeUser",
      method: "POST",
      body,
    }),
    invalidatesTags: ["ChangeLog"],
  }),
  createTask: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      BoardId: number;
      ColumnId: number;
      Title: string;
      ParentTaskItemId?: number;
      Description?: string;
    }
  >({
    query: (body) => ({
      url: "/Task/CreateTask",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Task"],
  }),
  updateTaskProperty: builder.mutation<
    BaseOutput<string>,
    UpdateTaskPropertyInput
  >({
    query: (body) => ({
      url: "/Task/UpdateTaskProperty",
      method: "POST",
      body,
    }),
    invalidatesTags: ["ChangeLog"],
  }),
  getTask: builder.query<BaseOutput<TaskType>, number>({
    query: (id) => ({ url: `/Task/GetTask?taskId=${id}` }),
  }),
  deleteTask: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/Task/DeleteTask?taskId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Task", "TaskRelation"],
  }),
  createSubtaskRelation: builder.mutation<
    BaseOutput<string>,
    {
      ParentTaskItemId: number;
      TaskId: number;
    }
  >({
    query: ({ ParentTaskItemId, TaskId }) => ({
      url: `/Task/CreateSubtaskRelation?parentTaskItemId=${ParentTaskItemId}&taskId=${TaskId}`,
      method: "POST",
    }),
    invalidatesTags: ["Task"],
  }),
  listTaskAttachments: builder.query<BaseOutput<TaskAttachmentType[]>, number>({
    query: (id) => ({ url: `/Task/ListTaskAttachments?taskId=${id}` }),
    providesTags: ["TaskAttachment"],
  }),
  updateTaskOrders: builder.mutation<
    BaseOutput<string>,
    {
      GroupedTasks: { [columnId: number]: number[] };
    }
  >({
    query: (body) => ({
      url: `/Task/UpdateTaskOrders`,
      method: "POST",
      body,
    }),
  }),
  sendTaskToTopOrBottom: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      Location: 1 | 0;
    }
  >({
    query: (body) => ({
      url: `/Task/SendTaskToTopOrBottom`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["Task"],
  }),
});
