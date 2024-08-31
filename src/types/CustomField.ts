import { PresetColor } from "../components/shared/colors";

export type CustomField = {
  Id: number;
  ProjectId: number;
  FieldName: string;
  FieldType: CustomFieldType;
  Enabled: boolean;
  ShowInTaskCard: boolean;
  SelectOptions: CustomFieldSelectOption[];
};

export type CustomFieldSelectOption = {
  Id: number;
  Color: PresetColor;
  Name: string;
};

export type CustomFieldValue = string | number | number[] | boolean | null;

export type TaskCustomFields = {
  [taskId: number]: {
    [customFieldId: number]: CustomFieldValue;
  };
};

export enum CustomFieldType {
  Text = "TEXT",
  Number = "NUMBER",
  SingleSelect = "SINGLESELECT",
  MultiSelect = "MULTISELECT",
  Date = "DATE",
  Bool = "BOOL",
}
