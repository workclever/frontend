import React from "react";
import { Roles, EntityClasses, Permissions } from "../types/Roles";
import {
  useGetUserQuery,
  useListMyAccessedEntitiesQuery,
} from "../services/api";

export const useMe = () => {
  const { data: me } = useGetUserQuery(null);
  const { data: accessedEntities } = useListMyAccessedEntitiesQuery(null);
  const roles = me?.Data.Roles || [];

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
      return !!(accessedEntities?.Data || []).find(
        (r) => r.Permission === permission && r.EntityClass === entityClass
      );
    }
    return !!(accessedEntities?.Data || []).find(
      (r) =>
        r.EntityId === entityId &&
        r.Permission === permission &&
        r.EntityClass === entityClass
    );
  };

  const isMe = (userId: number) => {
    return userId === me?.Data.Id;
  };

  return {
    me: me?.Data,
    isAdmin,
    accessedEntities: accessedEntities || [],
    hasAccess,
    hasRole,
    isMe,
  };
};
