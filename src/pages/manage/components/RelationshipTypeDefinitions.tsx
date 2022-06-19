import { ProColumns } from "@ant-design/pro-components";
import { CrudEditor } from "../../../components/shared/CrudEditor";
import { useTaskRelationTypeDefs } from "../../../hooks/useTaskRelationTypeDefs";
import {
  useUpdateTaskRelationTypeDefMutation,
  useCreateTaskRelationTypeDefMutation,
  useDeleteTaskRelationTypeDefMutation,
} from "../../../services/api";
import { TaskRelationTypeDef } from "../../../types/TaskRelationTypeDef";

export const RelationshipTypeDefinitions = () => {
  const data = useTaskRelationTypeDefs();
  const columns: ProColumns<TaskRelationTypeDef>[] = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "id",
      editable: false,
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "type",
    },
    {
      title: "Inward Operation Name",
      dataIndex: "InwardOperationName",
      key: "InwardOperationName",
    },
    {
      title: "Outward Operation Name",
      dataIndex: "OutwardOperationName",
      key: "OutwardOperationName",
    },
  ];

  const [updateDef] = useUpdateTaskRelationTypeDefMutation();
  const [createDef] = useCreateTaskRelationTypeDefMutation();
  const [deleteDef] = useDeleteTaskRelationTypeDefMutation();

  return (
    <>
      <CrudEditor<TaskRelationTypeDef>
        title="Task relations type definitions"
        columns={columns}
        dataSource={data || []}
        create={{
          triggerText: "Create new task relation type definition",
          execute: (values) => {
            createDef({
              ...values,
            });
          },
        }}
        edit={{
          modalTitle: "Update relation type",
          execute: (item, values) => {
            updateDef({
              Id: item.Id,
              ...values,
            });
          },
        }}
        delete={{
          modalTitle: "Delete this relation type definition?",
          execute: (item) => {
            deleteDef(item.Id);
          },
        }}
      />
    </>
  );
};
