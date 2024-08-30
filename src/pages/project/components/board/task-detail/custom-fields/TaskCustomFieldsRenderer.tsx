import React from "react";
import { useSelector } from "react-redux";
import {
  useListCustomFieldsQuery,
  useListTaskCustomFieldValuesByBoardQuery,
} from "../../../../../../services/api";
import {
  selectSelectedBoardId,
  selectSelectedProjectId,
} from "../../../../../../slices/project/projectSlice";
import { TaskType } from "../../../../../../types/Project";
import styled from "styled-components";
import { CustomFieldRow } from "./units/CustomFieldRow";
import { Text } from "../../../../../../components/shared/primitives/Text";

const TableContainer = styled.div``;

const TableRow = styled.div`
  display: flex;
  min-height: 30px;
  align-items: center;
  padding: 4px 0px;
`;

const TableKey = styled.div`
  width: 100px;
  font-weight: bold;
`;

const TableValue = styled.div`
  flex: 1;
`;

export const TaskCustomFieldsRenderer: React.FC<{ task: TaskType }> = ({
  task,
}) => {
  const projectId = Number(useSelector(selectSelectedProjectId));
  const boardId = Number(useSelector(selectSelectedBoardId));

  const { data: customFields } = useListCustomFieldsQuery(projectId);
  const customFieldsData = customFields?.Data || [];
  const customFieldsDataEnabled = customFieldsData.filter((r) => r.Enabled);

  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(Number(boardId));
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];

  const [activeInputId, setActiveInputId] = React.useState(0);

  const onActivatedInput = (inputId: number) => {
    setActiveInputId(inputId);
  };

  if (customFieldsDataEnabled.length === 0) {
    return null;
  }

  return (
    <>
      <Text strong>Custom fields</Text>
      <TableContainer>
        {customFieldsDataEnabled.map((r) => (
          <TableRow key={r.Id}>
            <TableKey>
              <Text>{r.FieldName}:</Text>
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
    </>
  );
};
