import { Result } from "antd";
import React from "react";
import { useMe } from "../../hooks/useMe";
import { Roles } from "../../types/Roles";

type Props = {
  children?: React.ReactNode;
  role: Roles;
  showWarning: boolean;
};

export const Role: React.FC<Props> = ({ children, role, showWarning }) => {
  const { hasRole } = useMe();

  if (hasRole(role)) {
    return <>{children}</>;
  }

  if (showWarning) {
    return (
      <Result
        status="403"
        title="403"
        subTitle={`You are not authorized to access this page. You need ${role} role.`}
      />
    );
  }

  return null;
};
