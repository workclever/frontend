import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { Form, Input } from "antd";
import React from "react";
import {
  useCreateCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
} from "@app/services/api";
import {
  CustomFieldSelectOption,
  CustomFieldType,
} from "@app/types/CustomField";
import { ColorPicker } from "@app/components/shared/ColorPicker";
import { Confirm } from "@app/components/shared/Confirm";
import { HttpResult } from "@app/components/shared/HttpResult";
import { randomColor } from "@app/components/shared/colors";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { MinusCircleIcon, PlusIcon } from "lucide-react";

export const createCustomFieldValues = {
  CustomFieldId: 0,
  FieldName: "",
  FieldType: "" as CustomFieldType,
  Enabled: true,
  // TODO remove
  ShowInTaskCard: true,
  SelectOptions: [] as CustomFieldSelectOption[],
};

export const CustomFieldEditorForm: React.FC<{
  initialValues: typeof createCustomFieldValues;
  onCloseModal: () => void;
  projectId: number;
}> = ({ initialValues, onCloseModal, projectId }) => {
  const [createCustomField, { error: createError, data: createResult }] =
    useCreateCustomFieldMutation();
  const [updateCustomField, { error: updateError, data: updateResult }] =
    useUpdateCustomFieldMutation();
  const [deleteCustomField] = useDeleteCustomFieldMutation();

  const isUpdateMode = initialValues.CustomFieldId !== 0;
  const error = isUpdateMode ? updateError : createError;
  const result = isUpdateMode ? updateResult : createResult;

  const isSelectableCustomFieldType = (fieldType: CustomFieldType) => {
    return (
      fieldType === CustomFieldType.MultiSelect ||
      fieldType === CustomFieldType.SingleSelect
    );
  };
  const [showSelectOptions, setshowSelectOptions] = React.useState(
    isSelectableCustomFieldType(initialValues.FieldType as CustomFieldType)
  );

  const onFinish = async (values: typeof createCustomFieldValues) => {
    if (isUpdateMode) {
      await updateCustomField({
        CustomFieldId: Number(initialValues.CustomFieldId),
        SelectOptions: values.SelectOptions,
        FieldName: values.FieldName,
        FieldType: values.FieldType,
        ShowInTaskCard: values.ShowInTaskCard,
        Enabled: values.Enabled,
      });
    } else {
      await createCustomField({
        ProjectId: projectId,
        SelectOptions: values.SelectOptions,
        FieldName: values.FieldName,
        FieldType: values.FieldType,
        ShowInTaskCard: values.ShowInTaskCard,
        Enabled: values.Enabled,
      });
      onCloseModal();
    }
    return true;
  };
  return (
    <ProForm
      initialValues={initialValues}
      onFinish={onFinish}
      autoComplete="off"
      onFieldsChange={(_, allFields) => {
        const fieldTypeField = allFields.find(
          // Somehow typings are not correct, so ignore it for now
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (r) => r.name.indexOf("FieldType") > -1
        );
        setshowSelectOptions(
          isSelectableCustomFieldType(fieldTypeField?.value as CustomFieldType)
        );
      }}
      style={{ padding: 10 }}
      submitter={{
        searchConfig: {
          submitText: "Save",
        },
        render: (_props, doms) => {
          return [
            // Get the 'Submit' dom only - on need to render reset (which is [0] item)
            doms[1],
            isUpdateMode && (
              <Confirm.Embed
                key="3"
                title="Are you sure delete field? This action is irreversible."
                onConfirm={async () => {
                  await deleteCustomField({
                    ProjectId: projectId,
                    CustomFieldId: initialValues.CustomFieldId,
                  });
                  onCloseModal();
                }}
              >
                <Button danger>Delete field</Button>
              </Confirm.Embed>
            ),
          ];
        },
      }}
    >
      <ProFormText
        label="Field name"
        name="FieldName"
        rules={[{ required: true }]}
        placeholder="Priority, Story points etc.."
      />
      <ProFormSelect
        label="Field type"
        name="FieldType"
        rules={[{ required: true }]}
        placeholder="Priority, Story points etc.."
        disabled={isUpdateMode}
        options={[
          { label: "Text", value: CustomFieldType.Text },
          { label: "Number", value: CustomFieldType.Number },
          { label: "Single select", value: CustomFieldType.SingleSelect },
          { label: "Multi select", value: CustomFieldType.MultiSelect },
          { label: "Date", value: CustomFieldType.Date },
          { label: "Bool", value: CustomFieldType.Bool },
        ]}
      />
      {showSelectOptions && (
        <Form.List name="SelectOptions">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space
                  key={index.toString()}
                  style={{ display: "flex", marginBottom: 4 }}
                  align="baseline"
                >
                  <Form.Item
                    name={[index, "Color"]}
                    rules={[{ required: true }]}
                  >
                    <ColorPicker />
                  </Form.Item>
                  <Form.Item
                    key={index.toString()}
                    name={[index, "Name"]}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <MinusCircleIcon
                    size={12}
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      Color: randomColor(),
                      Name: `Option ${fields.length + 1}`,
                    })
                  }
                  block
                  icon={<PlusIcon size={12} />}
                >
                  Add select option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      )}

      <ProFormSwitch label="Enabled" name="Enabled" />
      <ProFormSwitch label="Show in task card" name="ShowInTaskCard" />
      <div style={{ marginBottom: 16 }}>
        <HttpResult result={result} error={error} />
      </div>
    </ProForm>
  );
};
