import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { useCreateUserMutation } from "../../../../services/api";
import { HttpResult } from "../../../../components/shared/HttpResult";

export const CreateUserModal: React.FC<{
  onExit: () => void;
}> = ({ onExit }) => {
  const [createUser, { data: createResult, error: createError }] =
    useCreateUserMutation();

  const onFinish = async (values: any) => {
    await createUser({
      Email: values.Email,
      FullName: values.FullName,
      Password: values.Password,
    });
  };

  return (
    <ModalForm<any>
      title={"Create user"}
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
          width="md"
        />
        <ProFormText
          name="Email"
          label="Email"
          placeholder="Email"
          rules={[{ required: true, message: "Email of user" }]}
          width="md"
        />
        <ProFormText.Password
          name="Password"
          label="Password"
          placeholder="Password"
          rules={[{ required: true, message: "Password of user" }]}
          width="md"
        />
      </ProForm.Group>
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
