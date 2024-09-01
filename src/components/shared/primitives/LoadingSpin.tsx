import { Spin } from "antd";

export const LoadingSpin: React.FC<{
  size?: "small" | "default" | "large";
}> = ({ size }) => <Spin size={size} />;
