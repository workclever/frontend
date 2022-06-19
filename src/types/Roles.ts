export enum Roles {
  Admin = "ADMIN",
}

export enum Permissions {
  CanCollaborateProject = "COLLABORATE_PROJECT",
  CanManageProject = "CAN_MANAGE_PROJECT",
}

export enum EntityClasses {
  Project = "Project",
}

export type UserEntityAccess = {
  UserId: number;
  EntityClass: EntityClasses;
  EntityId: number;
  Permission: Permissions;
};
