import { PresetColor } from "../components/shared/colors";
import { BaseOutput } from "./BaseOutput";

export type ProjectType = {
  Id: number;
  Name: string;
  Slug: string;
};

export type ListUserProjectsOutput = BaseOutput<ProjectType[]>;

export type BoardType = {
  Id: number;
  ProjectId: number;
  Name: string;
};

export type ColumnType = {
  Id: number;
  Name: string;
  Order: number;
  Hidden: boolean;
  BoardId: number;
  Color: PresetColor;
};

export type ListBoardColumnsOutput = BaseOutput<ColumnType[]>;

export type TaskType = {
  Id: number;
  ProjectId: number;
  BoardId: number;
  ColumnId: number;
  Title: string;
  Description: string;
  ReporterUserId: number;
  AssigneeUserId: number;
  ParentTaskItemId: number | null;
  Order: number;
  Slug: string;
};

export type BasicUserOutput = {
  Id: number;
  FullName: string;
  Email: string;
  AvatarUrl?: string;
};

export type TaskCommentType = {
  Id: number;
  Content: string;
  DateCreated: string;
  TaskId: number;
  UserId: number;
};

export type TaskChangeLogType = {
  Id: number;
  Property: keyof TaskType;
  OldValue: string;
  NewValue: string;
  DateCreated: string;
  UserId: number;
};

export type ListTaskChangeLogOutput = BaseOutput<TaskChangeLogType[]>;

export type TaskRelationType = {
  Id: number;
  TaskId: number;
  TaskParentRelationId: number;
  RelationTypeDefId: number;
  RelationTypeDirection: "INWARD" | "OUTWARD";
};

export type ListTaskRelationsOutput = BaseOutput<TaskRelationType[]>;

export type TaskAttachmentType = {
  Name: string;
  DateCreated: string;
  AttachmentUrl: string;
};

export type BoardViewType = "kanban" | "graph" | "tree";
