import { Alert as AntdAlert } from "antd";

export const Alert: React.FC<{
  message: React.ReactNode;
  type: "warning" | "success" | "info" | "error";
}> = ({ message, type }) => {
  return <AntdAlert message={message} type={type} showIcon closable />;
};
