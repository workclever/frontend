import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { RegisterInput } from "../../types/Auth";
import { api, useRegisterMutation } from "../../services/api";
import { setToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { Button } from "../../components/shared/primitives/Button";
import { HttpResult } from "../../components/shared/HttpResult";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formState] = React.useState<RegisterInput>({
    FullName: "Asd aaa",
    Email: "asd@asd.com",
    Password: "Asd32!#",
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const onFinish = async (formState: RegisterInput) => {
    const RegisterOutput = await register(formState).unwrap();
    dispatch(setToken(RegisterOutput.Data));
    dispatch(api.util.resetApiState());
    navigate("/");
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={formState}
        onFinish={onFinish}
        autoComplete="off"
      >
        <HttpResult error={error} />
        <Form.Item
          label="Full name"
          name="FullName"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="Password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
