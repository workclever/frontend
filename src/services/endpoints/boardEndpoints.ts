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
    BaseOutput<BoardView>,
    {
      BoardId: number;
      Type: BoardViewType;
      Name: string;
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
  updateBoardView: builder.mutation<
    BaseOutput<string>,
    {
      BoardViewId: number;
      Name: string;
      VisibleCustomFields: number[];
    }
  >({
    query: (body) => ({
      url: "/Board/UpdateBoardView",
      method: "POST",
      body,
    }),
    invalidatesTags: ["BoardView"],
  }),
  deleteBoardView: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/Board/DeleteBoardView?boardViewId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["BoardView"],
  }),
});
