import { useListTaskCustomFieldValuesByBoardQuery } from "@app/services/api";
import { CustomField } from "@app/types/CustomField";
import { TaskType } from "@app/types/Project";
import { CustomFieldPreview } from "./CustomFieldPreview";

export const RenderTaskCustomField: React.FC<{
  task: TaskType;
  customField: CustomField;
}> = ({ task, customField }) => {
  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(task.BoardId);
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];
  if (!taskCustomFieldValuesData) {
    return null;
  }

  const customFieldValue = taskCustomFieldValuesData[customField.Id];

  return (
    <CustomFieldPreview
      customField={customField}
      customFieldValue={customFieldValue}
    />
  );
};
