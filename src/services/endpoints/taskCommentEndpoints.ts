import { BaseOutput } from "../../types/BaseOutput";
import { TaskCommentType } from "../../types/Project";
import { Builder } from "../types";

export const taskCommentEndpoints = (builder: Builder) => ({
  listTaskComments: builder.query<
    BaseOutput<{ [taskId: number]: TaskCommentType[] }>,
    number
  >({
    query: (id) => ({
      url: `/TaskComment/ListTaskCommentsByBoardId?boardId=${id}`,
    }),
    providesTags: ["TaskComments"],
  }),
  createTaskComment: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      Content: string;
    }
  >({
    query: (body) => ({
      url: `/TaskComment/CreateTaskComment`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskComments"],
  }),
  updateTaskComment: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      CommentId: number;
      Content: string;
    }
  >({
    query: (body) => ({
      url: `/TaskComment/UpdateTaskComment`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskComments"],
  }),
  deleteTaskComment: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      CommentId: number;
    }
  >({
    query: (body) => ({
      url: `/TaskComment/DeleteTaskComment`,
      method: "DELETE",
      body,
    }),
    invalidatesTags: ["TaskComments"],
  }),
});
