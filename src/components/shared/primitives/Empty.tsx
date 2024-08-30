import { Empty as AntdEmpty } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Empty: React.FC<Props> = ({ children }) => (
  <AntdEmpty description={children} />
);
