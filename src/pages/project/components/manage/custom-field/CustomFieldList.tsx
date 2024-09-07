import { Table } from "antd";
import React from "react";
import { Button } from "@app/components/shared/primitives/Button";
import { Modal } from "@app/components/shared/primitives/Modal";
import { useListCustomFieldsQuery } from "@app/services/api";
import { CustomField } from "@app/types/CustomField";
import {
  createCustomFieldValues,
  CustomFieldEditorForm,
} from "./CustomFieldEditorForm";
import { PencilIcon } from "lucide-react";
import { Space } from "@app/components/shared/primitives/Space";
import { Alert } from "@app/components/shared/primitives/Alert";

export const CustomFieldList: React.FC<{ projectId: number }> = ({
  projectId,
}) => {
  const { data: customFields } = useListCustomFieldsQuery(projectId, {
    skip: !projectId,
  });
  const customFieldsData = customFields?.Data || [];

  const [initialValues, setInitialValues] = React.useState<
    typeof createCustomFieldValues
  >(createCustomFieldValues);
  const [formModalVisible, setShowFormModalVisible] = React.useState(false);

  const columns = [
    {
      title: "Field name",
      dataIndex: "FieldName",
      key: "FieldName",
    },
    {
      title: "Field type",
      dataIndex: "FieldType",
      key: "FieldType",
    },
    {
      title: "Enabled?",
      dataIndex: "Enabled",
      key: "Enabled",
      render: (enabled: CustomField["Enabled"]) => {
        if (enabled) return "Enabled";
        return "Disabled";
      },
    },
    {
      title: "Show in task card?",
      dataIndex: "ShowInTaskCard",
      key: "ShowInTaskCard",
      render: (enabled: CustomField["ShowInTaskCard"]) => {
        if (enabled) return "Yes";
        return "No";
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "Action",
      render: (item: CustomField) => {
        return (
          <>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setInitialValues({
                  CustomFieldId: item.Id,
                  FieldType: item.FieldType,
                  FieldName: item.FieldName,
                  SelectOptions: item.SelectOptions,
                  ShowInTaskCard: item.ShowInTaskCard,
                  Enabled: item.Enabled,
                });
                setShowFormModalVisible(true);
              }}
            >
              <PencilIcon size={12} /> Click to modify
            </span>
          </>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" fullWidth>
      <Alert
        type="info"
        message="Create custom fields for tasks. For example you can create your own 'Sprint points' field or version etc."
      />
      <Table
        columns={columns}
        dataSource={customFieldsData}
        size="small"
        footer={() => (
          <Button
            type="primary"
            onClick={() => {
              setInitialValues(createCustomFieldValues);
              setShowFormModalVisible(true);
            }}
          >
            Add new custom field
          </Button>
        )}
      />
      {formModalVisible && (
        <Modal
          title={"Custom field"}
          visible={formModalVisible}
          onCancel={() => {
            setShowFormModalVisible(false);
          }}
          width={450}
        >
          <CustomFieldEditorForm
            projectId={projectId}
            initialValues={initialValues}
            onCloseModal={() => {
              setShowFormModalVisible(false);
            }}
          />
        </Modal>
      )}
    </Space>
  );
};
