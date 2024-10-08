export const TagTypes = [
  "Project",
  "Task",
  "TaskRelation",
  "ChangeLog",
  "TaskComments",
  "TaskAttachment",
  "Board",
  "BoardView",
  "User",
  "UserRole",
  "ProjectManagers",
  "TaskRelationTypeDef",
  "GetUser",
  "UserNotifications",
  "UnreadNotificationsCount",
  "UserAssignedProjectIds",
  "AccessedEntities",
  "SiteSettings",
  "CustomField",
  "TaskCustomFieldValues",
  "Column",
] as const;

export type TagTypesType = (typeof TagTypes)[number];
