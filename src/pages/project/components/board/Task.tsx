import { TaskType } from "@app/types/Project";
import { CustomField } from "@app/types/CustomField";
import React from "react";

export type Props = {
  task: TaskType;
  onTaskClick: () => void;
  findSubtasks: (id: number) => TaskType[];
  customFields: CustomField[];
  children?: React.ReactNode;
};
