import { EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../../components/shared/primitives/Button";
import { Modal } from "../../../../../components/shared/primitives/Modal";
import { useListCustomFieldsQuery } from "../../../../../services/api";
import { selectSelectedProjectId } from "../../../../../slices/projectSlice";
import { CustomField } from "../../../../../types/CustomField";
import {
  createCustomFieldValues,
  CustomFieldEditorForm,
} from "./CustomFieldEditorForm";

export const CustomFieldList = () => {
  const projectId = Number(useSelector(selectSelectedProjectId));
  const { data: customFields } = useListCustomFieldsQuery(projectId);
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
              <EditOutlined /> Click to modify
            </span>
          </>
        );
      },
    },
  ];

  return (
    <>
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
            initialValues={initialValues}
            onCloseModal={() => {
              setShowFormModalVisible(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};
