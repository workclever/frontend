import { ModalForm, ProForm, ProFormSelect } from "@ant-design/pro-components";
import { useCreateBoardViewMutation } from "@app/services/api";
import { HttpResult } from "@app/components/shared/HttpResult";
import { Space } from "@app/components/shared/primitives/Space";
import { UserIcon } from "lucide-react";
import { BoardViewType } from "@app/types/Project";

type FormValuesType = {
  Type: BoardViewType;
};

export const CreateBoardViewModal: React.FC<{
  boardId: number;
  onExit: () => void;
}> = ({ boardId, onExit }) => {
  const [createBoardView, { data: createResult, error: createError }] =
    useCreateBoardViewMutation();

  const onFinish = async (values: FormValuesType) => {
    await createBoardView({
      Type: values.Type,
      BoardId: boardId,
    });
  };

  return (
    <ModalForm<FormValuesType>
      title={
        <Space>
          <UserIcon size={15} />
          <span>Create new board view</span>
        </Space>
      }
      open
      autoFocusFirstInput
      modalProps={{
        width: 400,
        cancelText: "Cancel",
        okText: "Save",
        onCancel: onExit,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="Type"
          label="Type"
          placeholder="Type"
          rules={[{ required: true, message: "Full name of user" }]}
          options={[
            { label: "Kanban", value: "kanban" },
            { label: "Tree", value: "tree" },
          ]}
        />
      </ProForm.Group>
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
