import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import { ListBoardColumnsOutput } from "../../types/Project";

export const columnEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  listBoardColumns: builder.query<ListBoardColumnsOutput, number>({
    query: (id) => ({ url: `/Column/ListBoardColumns?boardId=${id}` }),
    providesTags: ["Column"],
  }),
  createBoardColumn: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      BoardId: number;
      Name: string;
      Hidden: boolean;
    }
  >({
    query: (body) => ({
      url: "/Column/CreateBoardColumn",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Column"],
  }),
  updateBoardColumn: builder.mutation<
    BaseOutput<string>,
    {
      ColumnId: number;
      Name: string;
      Hidden: boolean;
      Color: string;
    }
  >({
    query: (body) => ({
      url: "/Column/UpdateBoardColumn",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Column"],
  }),
  updateColumnOrders: builder.mutation<
    BaseOutput<string>,
    {
      BoardId: number;
      ColumnIds: number[];
    }
  >({
    query: (body) => ({
      url: `/Column/UpdateColumnOrders`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["Column"],
  }),
  deleteColumn: builder.mutation<BaseOutput<string>, number>({
    query: (id) => ({
      url: `/Column/DeleteColumn?columnId=${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Column"],
  }),
});
