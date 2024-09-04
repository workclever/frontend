import { BaseOutput } from "./BaseOutput";

export type User = {
  Id: number;
  FullName: string;
  Email: string;
  EmailConfirmed: boolean;
  AvatarUrl?: string;
  Roles: string[];
  Preferences: {
    Timezone: string;
  };
};

export type GetUserOutput = BaseOutput<User>;

export type UserNotificationType = {
  Id: number;
  ByUserId: number;
  DateCreated: string;
  Content: string;
  Type: string;
  TaskId: number | null;
};
