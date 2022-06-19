import { debounce } from "lodash";
import React from "react";
import styled from "styled-components";
import { LoadingSpin } from "../../../../../../../components/shared/primitives/LoadingSpin";
import { useCreateCustomFieldTaskValueMutation } from "../../../../../../../services/api";
import {
  CustomField,
  CustomFieldValue,
  CustomFieldType,
} from "../../../../../../../types/CustomField";
import { TaskType } from "../../../../../../../types/Project";
import { RenderTaskCustomField } from "../../../Task";
import { CustomFieldRowBool } from "./CustomFieldRowBool";
import { CustomFieldRowDate } from "./CustomFieldRowDate";
import { CustomFieldRowMultiSelect } from "./CustomFieldRowMultiSelect";
import { CustomFieldRowSelect } from "./CustomFieldRowSelect";
import { CustomFieldRowText } from "./CustomFieldRowText";

const CustomFieldValuePreview = styled.div`
  padding: 4px;
  &:hover {
    background-color: #efefef;
    cursor: pointer;
  }
`;

export const CustomFieldRow: React.FC<{
  task: TaskType;
  field: CustomField;
  fieldValue?: CustomFieldValue;
  onActivated: (inputId: number) => void;
  activeInputId: number;
}> = ({ task, field, fieldValue, onActivated, activeInputId }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [createCustomFieldTaskValue, { isLoading }] =
    useCreateCustomFieldTaskValueMutation();

  const onUpdateValue = (newValue: any) => {
    createCustomFieldTaskValue({
      TaskId: task.Id,
      CustomFieldId: field.Id,
      Value: String(newValue),
    });
  };

  const onUpdateValueDebounced = debounce(onUpdateValue, 200);

  const onActivate = () => {
    setEditMode(true);
    onActivated(field.Id);
  };

  const onBlur = () => {
    setEditMode(false);
  };

  React.useEffect(() => {
    if (activeInputId !== field.Id) {
      setEditMode(false);
    }
  }, [activeInputId, field]);

  const getInput = () => {
    const inputs: { [key: string]: any } = {
      [CustomFieldType.Text]: (
        <CustomFieldRowText
          field={field}
          fieldValue={fieldValue as string}
          onUpdateValue={onUpdateValueDebounced}
          inputType="text"
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
      [CustomFieldType.Number]: (
        <CustomFieldRowText
          field={field}
          fieldValue={fieldValue as number}
          onUpdateValue={onUpdateValueDebounced}
          inputType="number"
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
      [CustomFieldType.Date]: (
        <CustomFieldRowDate
          field={field}
          fieldValue={fieldValue as string}
          onUpdateValue={(r) => {
            onUpdateValueDebounced(r);
          }}
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
      [CustomFieldType.Bool]: (
        <CustomFieldRowBool
          field={field}
          fieldValue={fieldValue as boolean}
          onUpdateValue={(r) => {
            onUpdateValueDebounced(r);
          }}
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
      [CustomFieldType.SingleSelect]: (
        <CustomFieldRowSelect
          field={field}
          fieldValue={fieldValue as number}
          onUpdateValue={onUpdateValueDebounced}
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
      [CustomFieldType.MultiSelect]: (
        <CustomFieldRowMultiSelect
          field={field}
          fieldValue={fieldValue as number[]}
          onUpdateValue={(r) => {
            onUpdateValueDebounced(r);
          }}
          loading={isLoading}
          onBlur={onBlur}
        />
      ),
    };
    return inputs[field.FieldType];
  };

  return (
    <span>
      {editMode ? (
        getInput()
      ) : (
        <CustomFieldValuePreview onClick={onActivate}>
          <RenderTaskCustomField task={task} customField={field} />{" "}
          {isLoading && <LoadingSpin size="small" />}
        </CustomFieldValuePreview>
      )}
    </span>
  );
};
