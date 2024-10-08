import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { HttpResult } from "@app/components/shared/HttpResult";
import { useUpdateUserMutation } from "@app/services/api";
import { BasicUserOutput } from "@app/types/Project";

type FormValuesType = {
  FullName: string;
};

export const EditUserModal: React.FC<{
  editingUser: BasicUserOutput;
  onExit: () => void;
}> = ({ editingUser, onExit }) => {
  const [updateUser, { data: updateResult, error: updateError }] =
    useUpdateUserMutation();

  const onFinish = async (values: FormValuesType) => {
    await updateUser({
      UserId: editingUser?.Id,
      FullName: values.FullName,
    });
  };

  return (
    <ModalForm<FormValuesType>
      title={`Edit user ${editingUser.Email}`}
      visible
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
        <ProFormText
          name="FullName"
          label="FullName"
          placeholder="FullName"
          rules={[{ required: true, message: "Full name of user" }]}
          initialValue={editingUser.FullName}
          width="md"
        />
      </ProForm.Group>
      <HttpResult error={updateError} result={updateResult} />
    </ModalForm>
  );
};
