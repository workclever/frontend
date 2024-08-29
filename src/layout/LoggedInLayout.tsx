import { ProLayout } from "@ant-design/pro-components";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const LoggedInLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        location={{
          pathname: "/home",
        }}
        collapsedButtonRender={false}
        // collapsed
        headerRender={false}
      >
        {children}
      </ProLayout>
    </div>
  );
};
