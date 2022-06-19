import { BaseOutput } from "./BaseOutput";

export type LoginInput = {
  Email: string;
  Password: string;
};

export type LoginOutput = BaseOutput<string>;

export type RegisterInput = {
  FullName: string;
  Email: string;
  Password: string;
};

export type RegisterOutput = BaseOutput<string>;
