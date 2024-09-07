import { ProColumns } from "@ant-design/pro-components";
import { CrudEditor } from "@app/components/shared/CrudEditor";
import { Alert } from "@app/components/shared/primitives/Alert";
import { Space } from "@app/components/shared/primitives/Space";
import { useTaskRelationTypeDefs } from "@app/hooks/useTaskRelationTypeDefs";
import {
  useUpdateTaskRelationTypeDefMutation,
  useCreateTaskRelationTypeDefMutation,
  useDeleteTaskRelationTypeDefMutation,
} from "@app/services/api";
import { TaskRelationTypeDef } from "@app/types/TaskRelationTypeDef";

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
      fieldProps: {
        placeholder: "Type",
      },
    },
    {
      title: "Inward Operation Name",
      dataIndex: "InwardOperationName",
      key: "InwardOperationName",
      fieldProps: {
        placeholder: "Inward Operation Name",
      },
    },
    {
      title: "Outward Operation Name",
      dataIndex: "OutwardOperationName",
      key: "OutwardOperationName",
      fieldProps: {
        placeholder: "Outward Operation Name",
      },
    },
  ];

  const [updateDef] = useUpdateTaskRelationTypeDefMutation();
  const [createDef] = useCreateTaskRelationTypeDefMutation();
  const [deleteDef] = useDeleteTaskRelationTypeDefMutation();

  return (
    <Space direction="vertical" fullWidth>
      <Alert
        type="info"
        message={`
            If you want to be able to connect your tasks with relations, you can create them here.
            For example you can create 2 relationship definition called "Blocks" and "Blocked by" and use them to connect your tasks.
            `}
      />
      <CrudEditor<TaskRelationTypeDef>
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
          triggerText: "Update relation type",
          execute: (item, values) => {
            updateDef({
              Id: item.Id,
              InwardOperationName: values.InwardOperationName,
              OutwardOperationName: values.OutwardOperationName,
              Type: values.Type,
            });
          },
        }}
        delete={{
          triggerText: "Delete this relation type definition?",
          execute: (item) => {
            deleteDef(item.Id);
          },
        }}
      />
    </Space>
  );
};
