import { ProColumns } from "@ant-design/pro-components";
import React from "react";
import {
  useUpdateBoardMutation,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useListAllBoardsQuery,
} from "@app/services/api";
import { BoardType } from "@app/types/Project";
import { CrudEditor } from "@app/components/shared/CrudEditor";

export const ProjectBoards: React.FC<{ projectId: number }> = ({
  projectId,
}) => {
  const { data: allBoards } = useListAllBoardsQuery(null);
  const projectBoards = (allBoards?.Data || []).filter(
    (r) => r.ProjectId === projectId
  );
  const columns: ProColumns<BoardType>[] = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "id",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
    },
  ];

  const [updateBoard] = useUpdateBoardMutation();
  const [createBoard] = useCreateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  return (
    <>
      <CrudEditor<BoardType>
        columns={columns}
        dataSource={projectBoards}
        create={{
          triggerText: "Create new board",
          execute: (values) => {
            createBoard({
              ProjectId: projectId,
              ...values,
            });
          },
        }}
        edit={{
          modalTitle: "Update board",
          execute: (item, values) => {
            updateBoard({
              BoardId: item.Id,
              ...values,
            });
          },
        }}
        delete={{
          modalTitle: "Delete board?",
          execute: (item) => {
            deleteBoard(item.Id);
          },
        }}
      ></CrudEditor>
    </>
  );
};
