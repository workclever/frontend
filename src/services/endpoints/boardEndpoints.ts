import { BaseOutput } from "../../types/BaseOutput";
import { BoardType, BoardView, BoardViewType } from "../../types/Project";
import { Builder } from "../types";

export const boardEndpoints = (builder: Builder) => ({
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
  createBoardView: builder.mutation<
    BaseOutput<unknown>,
    {
      BoardId: number;
      Type: BoardViewType;
    }
  >({
    query: (body) => ({
      url: "/Board/CreateBoardView",
      method: "POST",
      body,
    }),
    invalidatesTags: ["BoardView"],
  }),
  listBoardViewsByBoardId: builder.query<BaseOutput<BoardView[]>, number>({
    query: (id) => ({ url: `/Board/ListBoardViewsByBoardId?boardId=${id}` }),
    providesTags: ["BoardView"],
  }),
});
