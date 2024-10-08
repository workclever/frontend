import React from "react";
import {
  useListCustomFieldsQuery,
  useListTaskCustomFieldValuesByBoardQuery,
} from "@app/services/api";
import { TaskType } from "@app/types/Project";
import { CustomFieldRow } from "./units/CustomFieldRow";
import {
  TableContainer,
  TableRow,
  TableKey,
  TableValue,
} from "../../fields/FieldContainers";

export const TaskCustomFieldsRenderer: React.FC<{ task: TaskType }> = ({
  task,
}) => {
  const { data: customFields } = useListCustomFieldsQuery(task.ProjectId);
  const customFieldsData = customFields?.Data || [];
  const customFieldsDataEnabled = customFieldsData.filter((r) => r.Enabled);

  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(task.BoardId);
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];

  const [activeInputId, setActiveInputId] = React.useState(0);

  const onActivatedInput = (inputId: number) => {
    setActiveInputId(inputId);
  };

  if (customFieldsDataEnabled.length === 0) {
    return null;
  }

  return (
    <TableContainer>
      {customFieldsDataEnabled.map((r) => (
        <TableRow key={r.Id}>
          <TableKey>
            <span>{r.FieldName}:</span>
          </TableKey>
          <TableValue>
            <CustomFieldRow
              key={r.Id}
              task={task}
              field={r}
              fieldValue={
                taskCustomFieldValuesData
                  ? taskCustomFieldValuesData[r.Id]
                  : undefined
              }
              onActivated={onActivatedInput}
              activeInputId={activeInputId}
            />
          </TableValue>
        </TableRow>
      ))}
    </TableContainer>
  );
};
