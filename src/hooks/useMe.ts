import React, { useContext } from "react";
import { SiteContext } from "../contexts/SiteContext";
import { Roles, EntityClasses, Permissions } from "../types/Roles";

export const useMe = () => {
  const { me, accessedEntities } = useContext(SiteContext);
  const roles = me?.Roles || [];

  const hasRole = React.useCallback(
    (role: Roles) => {
      return roles.indexOf(role) > -1;
    },
    [roles]
  );

  const isAdmin = React.useMemo(() => hasRole(Roles.Admin), [hasRole]);

  const hasAccess = (
    entityId: number | "all",
    permission: Permissions,
    entityClass: EntityClasses
  ) => {
    if (isAdmin) {
      return true;
    }
    if (entityId === "all") {
      return !!(accessedEntities || []).find(
        (r) => r.Permission === permission && r.EntityClass === entityClass
      );
    }
    return !!(accessedEntities || []).find(
      (r) =>
        r.EntityId === entityId &&
        r.Permission === permission &&
        r.EntityClass === entityClass
    );
  };

  const isMe = (userId: number) => {
    return userId === me?.Id;
  };

  return {
    me: me,
    isAdmin,
    accessedEntities: accessedEntities || [],
    hasAccess,
    hasRole,
    isMe,
  };
};
