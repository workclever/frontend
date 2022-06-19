import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import { BoardType } from "../../types/Project";

export const boardEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  listAllBoards: builder.query<BaseOutput<BoardType[]>, null>({
    query: () => ({ url: `/Board/ListAllBoards` }),
    providesTags: ["Board"],
  }),
  createBoard: builder.mutation<
    BaseOutput<BoardType>,
    {
      ProjectId: number;
      Name: string;
    }
  >({
    query: (body) => ({
      url: "/Board/CreateBoard",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Board"],
  }),
  updateBoard: builder.mutation<
    BaseOutput<string>,
    {
      BoardId: number;
      Name: string;
    }
  >({
    query: (body) => ({
      url: "/Board/UpdateBoard",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Board"],
  }),
  deleteBoard: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/Board/DeleteBoard?boardId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Board"],
  }),
  getBoard: builder.query<BaseOutput<BoardType>, number>({
    query: (id) => ({ url: `/Board/GetBoard?boardId=${id}` }),
  }),
});
