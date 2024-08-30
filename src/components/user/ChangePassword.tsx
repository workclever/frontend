import { Button, Form, Input } from "antd";
import { useChangePasswordMutation } from "../../services/api";
import { HttpResult } from "../shared/HttpResult";

type FormValuesType = {
  OldPassword: string;
  NewPassword: string;
  NewPasswordRepeat: string;
};

export const ChangePassword = () => {
  const [changePassword, { error, data }] = useChangePasswordMutation();

  const onFinish = async (values: FormValuesType) => {
    if (values.NewPassword !== values.NewPasswordRepeat) {
      alert("Password confirmation doesn't match with the new password");
      return;
    }
    changePassword({
      OldPassword: values.OldPassword,
      NewPassword: values.NewPassword,
    });
  };
  return (
    <>
      <Form<FormValuesType>
        name="change-password"
        initialValues={{}}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        autoComplete="off"
        style={{ width: 550 }}
        labelAlign="left"
      >
        <Form.Item
          label="Old password"
          name="OldPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New password"
          name="NewPassword"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New password confirm"
          name="NewPasswordRepeat"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Change password
          </Button>
        </Form.Item>
        <HttpResult error={error} result={data} />
      </Form>
    </>
  );
};
