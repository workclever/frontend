import { Result } from "antd";
import React from "react";
import { useMe } from "../../hooks/useMe";
import { EntityClasses, Permissions } from "../../types/Roles";

type Props = {
  children?: React.ReactNode;
  permission: Permissions;
  entityId: number | "all";
  entityClass: EntityClasses;
  showWarning: boolean;
};

export const Permission: React.FC<Props> = ({
  children,
  permission,
  entityId,
  entityClass,
  showWarning,
}) => {
  const { isAdmin, hasAccess } = useMe();

  if (isAdmin || hasAccess(entityId, permission, entityClass)) {
    return <>{children}</>;
  }

  if (showWarning) {
    return (
      <Result
        status="403"
        title="403"
        subTitle={`You are not authorized to access this page. You need ${permission} permission on: ${entityClass} ${entityId}`}
      />
    );
  }

  return null;
};
