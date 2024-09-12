import { CustomFieldValue, TaskCustomFields } from "@app/types/CustomField";
import { ColumnType, TaskType, BoardGroupableKey } from "@app/types/Project";
import { CUSTOM_FIELD_PREFIX, FIELD_UNASSIGNED } from "./constants";

export const getGroupValue = <T>(item: T, key: BoardGroupableKey): number => {
  const value = item[key as keyof T];

  if (typeof value === "number") {
    return value;
  }

  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    throw new Error(
      `Cannot convert value for key "${String(key)}" to a number.`
    );
  }

  return numericValue;
};

const getDistinctValues = (arr: CustomFieldValue[]): CustomFieldValue[] => {
  return [...new Set(arr)];
};

export const getAllDistinctGroupValuesPerGroupableKey = ({
  columns,
  tasks,
  taskCustomFieldValuesMap,
}: {
  columns: ColumnType[];
  tasks: TaskType[];
  taskCustomFieldValuesMap: TaskCustomFields;
}) => {
  const map: { [key in BoardGroupableKey]: CustomFieldValue[] } = {
    ColumnId: columns.map((r) => r.Id),
    ReporterUserId: tasks.map((r) => r.ReporterUserId),
  };

  for (const taskId in taskCustomFieldValuesMap) {
    const taskCustomFields = taskCustomFieldValuesMap[taskId];
    for (const customFieldId in taskCustomFields) {
      const customFieldIdNumber = Number(customFieldId);
      const customFieldValue = taskCustomFields[customFieldIdNumber];
      const mapKey: BoardGroupableKey = `${CUSTOM_FIELD_PREFIX}${customFieldIdNumber}`;

      if (!map[mapKey]) {
        map[mapKey] = [];
      }
      if (
        typeof customFieldValue === "undefined" ||
        customFieldValue === null
      ) {
        map[mapKey].push(FIELD_UNASSIGNED);
      } else {
        map[mapKey].push(customFieldValue);
      }
    }
  }

  for (const groupableKey in map) {
    map[groupableKey as BoardGroupableKey] = getDistinctValues(
      map[groupableKey as BoardGroupableKey]
    );
  }

  return map;
};
