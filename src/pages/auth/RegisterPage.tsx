import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, useRegisterMutation } from "../../services/api";
import { setToken } from "../../slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { HttpResult } from "../../components/shared/HttpResult";

import { LoginFormPage, ProFormText } from "@ant-design/pro-components";
import {
  ChevronRightCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { Space } from "@app/components/shared/primitives/Space";

type FormValuesType = {
  FullName: string;
  Email: string;
  Password: string;
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading, error }] = useRegisterMutation();

  const onFinish = async (formState: FormValuesType) => {
    if (isLoading) {
      return;
    }
    const RegisterOutput = await register(formState).unwrap();
    dispatch(setToken(RegisterOutput.Data));
    dispatch(api.util.resetApiState());
    navigate("/");
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <LoginFormPage<FormValuesType>
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        title="WorkClever"
        subTitle="Register"
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "Register",
          },
        }}
        actions={
          <Link to="/login">
            <Space>
              Login
              <ChevronRightCircleIcon />
            </Space>
          </Link>
        }
      >
        <>
          <div style={{ paddingBottom: 16 }}>
            <HttpResult error={error} />
          </div>
          <ProFormText
            name="FullName"
            fieldProps={{
              size: "large",
              prefix: <UserIcon />,
            }}
            placeholder="Full name"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          />
          <ProFormText
            name="Email"
            fieldProps={{
              size: "large",
              prefix: <MailIcon />,
            }}
            placeholder="Email"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          />
          <ProFormText.Password
            name="Password"
            fieldProps={{
              size: "large",
              prefix: <LockIcon />,
            }}
            placeholder={"Password"}
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          />
        </>
      </LoginFormPage>
    </div>
  );
};
