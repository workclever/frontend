import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, useLoginMutation } from "../../services/api";
import { setToken } from "../../slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { HttpResult } from "../../components/shared/HttpResult";
import { ProFormText, LoginFormPage } from "@ant-design/pro-components";
import { Space } from "../../components/shared/primitives/Space";
import { Button } from "../../components/shared/primitives/Button";
import { ChevronRightCircleIcon, LockIcon, MailIcon } from "lucide-react";

type FormValuesType = { Email: string; Password: string };

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading, error }] = useLoginMutation();

  const onFinish = async (formState: FormValuesType) => {
    if (isLoading) {
      return;
    }
    const loginOutput = await login(formState).unwrap();
    dispatch(setToken(loginOutput.Data));
    dispatch(api.util.resetApiState());
    navigate("/");
  };

  const [showWelcomeConfig, setShowWelcomeConfig] = React.useState(true);
  const welcomeConfig: React.ComponentProps<
    typeof LoginFormPage
  >["activityConfig"] = {
    style: {
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
      color: "#fff",
      borderRadius: 8,
    },
    title: "Welcome to WorkClever",
    subTitle: "This website is serving only for demo purposes.",
    action: (
      <Button size="large" onClick={() => setShowWelcomeConfig(false)}>
        Close
      </Button>
    ),
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
        subTitle="Login"
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "Login",
          },
        }}
        actions={
          <Link to="/register">
            <Space>
              Register
              <ChevronRightCircleIcon />
            </Space>
          </Link>
        }
        activityConfig={showWelcomeConfig ? welcomeConfig : undefined}
      >
        <>
          <div style={{ paddingBottom: 16 }}>
            <HttpResult error={error} />
          </div>
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
        <div
          style={{
            marginBottom: 24,
          }}
        >
          {/* <a
            style={{
              float: "right",
            }}
          >
            Forgot password
          </a> */}
        </div>
      </LoginFormPage>
    </div>
  );
};
