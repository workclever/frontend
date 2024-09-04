import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { omit } from "lodash";
import React from "react";
import { useUpdateBoardColumnMutation } from "@app/services/api";
import { ColumnType } from "@app/types/Project";
import { ColorPicker } from "@app/components/shared/ColorPicker";

export const EditColumnModal: React.FC<{
  onCancel: () => void;
  column: ColumnType;
}> = ({ onCancel, column }) => {
  const [updateColumn] = useUpdateBoardColumnMutation();

  const onFinish = (value: ColumnType) => {
    updateColumn({
      ColumnId: column?.Id,
      ...omit(column, "Id"),
      Name: value.Name,
      Color: value.Color,
    });
    onCancel();
  };

  return (
    <ModalForm<ColumnType>
      open
      title="Edit column"
      autoFocusFirstInput
      modalProps={{
        width: 300,
        cancelText: "Cancel",
        okText: "Save",
        onCancel,
      }}
      onFinish={async (values) => onFinish(values)}
      initialValues={{
        Name: column.Name,
        Color: column.Color || "red",
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="Name"
          label="Column name"
          placeholder="Column name"
        />
      </ProForm.Group>
      <ProForm.Item name="Color" label="Color of column">
        <ColorPicker />
      </ProForm.Item>
    </ModalForm>
  );
};
