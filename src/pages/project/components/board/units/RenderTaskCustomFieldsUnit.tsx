import { useListTaskCustomFieldValuesByBoardQuery } from "@app/services/api";
import { CustomField } from "@app/types/CustomField";
import { TaskType } from "@app/types/Project";
import { RenderTaskCustomField } from "./RenderTaskCustomField";
import { Space } from "@app/components/shared/primitives/Space";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";

export const RenderTaskCustomFieldsUnit: React.FC<{
  task: TaskType;
  customFields: CustomField[];
}> = ({ task, customFields }) => {
  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(Number(task.BoardId));
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];
  if (!taskCustomFieldValuesData) {
    return null;
  }
  const filledCustomValues = customFields.filter(
    (r) =>
      taskCustomFieldValuesData[r.Id] ||
      // Get also false values, since Bool type can have false value
      taskCustomFieldValuesData[r.Id] === false
  );
  return (
    <Space wrap>
      {filledCustomValues.map((customField) => {
        return (
          <Tooltip key={customField.Id} title={customField.FieldName}>
            <span>
              <RenderTaskCustomField task={task} customField={customField} />
            </span>
          </Tooltip>
        );
      })}
    </Space>
  );
};
