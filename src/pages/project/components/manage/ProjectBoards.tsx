import { ProColumns } from "@ant-design/pro-components";
import React from "react";
import { useSelector } from "react-redux";
import { useBoards } from "../../../../hooks/useBoards";
import {
  useUpdateBoardMutation,
  useCreateBoardMutation,
  useDeleteBoardMutation,
} from "../../../../services/api";
import { selectSelectedProjectId } from "../../../../slices/projectSlice";
import { BoardType } from "../../../../types/Project";
import { CrudEditor } from "../../../../components/shared/CrudEditor";

export const ProjectBoards: React.FC = () => {
  const projectId = Number(useSelector(selectSelectedProjectId));
  const data = useBoards();
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
        dataSource={data}
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
