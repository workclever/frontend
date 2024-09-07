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
import { Space } from "@app/components/shared/primitives/Space";
import { Alert } from "@app/components/shared/primitives/Alert";

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
      fieldProps: {
        placeholder: "Board name",
      },
    },
  ];

  const [updateBoard] = useUpdateBoardMutation();
  const [createBoard] = useCreateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  return (
    <Space direction="vertical" fullWidth>
      <Alert
        type="info"
        message="Users under a project has access to all the boards."
      />
      <CrudEditor<BoardType>
        columns={columns}
        dataSource={projectBoards}
        create={{
          triggerText: "Create new board",
          execute: (values) => {
            createBoard({
              ProjectId: projectId,
              Name: values.Name,
            });
          },
        }}
        edit={{
          triggerText: "Update board",
          execute: (item, values) => {
            updateBoard({
              BoardId: item.Id,
              ...values,
            });
          },
        }}
        delete={{
          triggerText: "Delete board?",
          execute: (item) => {
            deleteBoard(item.Id);
          },
        }}
      ></CrudEditor>
    </Space>
  );
};
