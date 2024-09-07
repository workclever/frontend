import { UpdateTaskPropertyParams } from "@app/types/Task";
import { BaseOutput } from "../../types/BaseOutput";
import {
  ListTaskChangeLogOutput,
  TaskType,
  TaskAttachmentType,
} from "../../types/Project";
import { taskUpdateLocalState } from "../optimistic/taskUpdateLocalState";
import { Builder } from "../types";

export const taskEndpoints = (builder: Builder) => ({
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
      Task: TaskType;
      TargetBoardId: number;
      TargetColumnId: number;
    }
  >({
    query: (body) => ({
      url: "/Task/MoveTaskToColumn",
      method: "POST",
      body: {
        TaskId: body.Task.Id,
        TargetBoardId: body.TargetBoardId,
        TargetColumnId: body.TargetColumnId,
      },
    }),
    async onQueryStarted(
      { Task, TargetBoardId, TargetColumnId },
      { dispatch, queryFulfilled }
    ) {
      const { undoLocal } = taskUpdateLocalState(
        Task,
        [
          { property: "BoardId", value: TargetBoardId },
          { property: "ColumnId", value: TargetColumnId },
        ],
        dispatch
      );
      try {
        await queryFulfilled;
      } catch {
        undoLocal();
      }
    },
  }),
  updateTaskAssigneeUser: builder.mutation<
    BaseOutput<string>,
    {
      Task: TaskType;
      UserIds: number[];
    }
  >({
    query: (body) => ({
      url: "/Task/UpdateTaskAssigneeUser",
      method: "POST",
      body: {
        UserIds: body.UserIds,
        TaskId: body.Task.Id,
      },
    }),
    invalidatesTags: ["ChangeLog"],
    async onQueryStarted({ Task, UserIds }, { dispatch, queryFulfilled }) {
      const { undoLocal } = taskUpdateLocalState(
        Task,
        { property: "AssigneeUserIds", value: UserIds },
        dispatch
      );
      try {
        await queryFulfilled;
      } catch {
        undoLocal();
      }
    },
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
    {
      Task: TaskType;
      Params: UpdateTaskPropertyParams;
    }
  >({
    query: (body) => ({
      url: "/Task/UpdateTaskProperty",
      method: "POST",
      body: {
        TaskId: body.Task.Id,
        Property: body.Params.property,
        Value:
          typeof body.Params.value === "undefined" ? null : body.Params.value,
      },
    }),
    invalidatesTags: ["ChangeLog"],
    async onQueryStarted({ Task, Params }, { dispatch, queryFulfilled }) {
      const { undoLocal } = taskUpdateLocalState(Task, Params, dispatch);
      try {
        await queryFulfilled;
      } catch {
        undoLocal();
      }
    },
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
    invalidatesTags: ["Task"],
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
