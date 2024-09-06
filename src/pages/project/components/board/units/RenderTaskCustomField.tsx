import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tag } from "@app/components/shared/primitives/Tag";
import { useFormattedDate } from "@app/hooks/useFormattedDate";
import { useListTaskCustomFieldValuesByBoardQuery } from "@app/services/api";
import { CustomField, CustomFieldType } from "@app/types/CustomField";
import { TaskType } from "@app/types/Project";
import { Space } from "antd";

const FieldTag: React.FC<{ color?: string; children?: React.ReactNode }> = ({
  color,
  children,
}) => {
  return (
    <Tag
      style={{
        border: "none",
        backgroundColor: color || "#eaeaea",
      }}
    >
      {children}
    </Tag>
  );
};

const RenderDate = ({ customFieldValue }: { customFieldValue: string }) => {
  const formattedDate = useFormattedDate(customFieldValue);
  if (!formattedDate) {
    return null;
  }
  return <FieldTag>{formattedDate}</FieldTag>;
};

export const RenderTaskCustomField: React.FC<{
  task: TaskType;
  customField: CustomField;
}> = ({ task, customField }) => {
  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(Number(task.BoardId));
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];
  if (!taskCustomFieldValuesData) {
    return null;
  }

  const emptyValue = () => (
    <div style={{ height: 25, width: "100%", minWidth: 150 }}>&nbsp;</div>
  );

  const customFieldValue = taskCustomFieldValuesData[customField.Id];

  if (customField.FieldType === CustomFieldType.Text) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <FieldTag>{customFieldValue}</FieldTag>;
  }
  if (customField.FieldType === CustomFieldType.Number) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <FieldTag>{customFieldValue}</FieldTag>;
  }
  if (customField.FieldType === CustomFieldType.Date) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <RenderDate customFieldValue={customFieldValue as string} />;
  }
  if (customField.FieldType === CustomFieldType.Bool) {
    return (
      <FieldTag>
        {customFieldValue ? <CheckOutlined /> : <CloseOutlined />}
      </FieldTag>
    );
  }
  if (customField.FieldType === CustomFieldType.SingleSelect) {
    if (!customFieldValue) {
      return emptyValue();
    }
    const optionDefinition = customField.SelectOptions.find(
      (r) => r.Id === customFieldValue
    );
    return (
      <FieldTag color={optionDefinition?.Color}>
        {optionDefinition?.Name}
      </FieldTag>
    );
  }
  if (customField.FieldType === CustomFieldType.MultiSelect) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return (
      <Space wrap>
        {(customFieldValue as number[]).map((id) => {
          const selectOption = customField.SelectOptions.find(
            (r) => r.Id === id
          );
          if (!selectOption) return null;
          return (
            <FieldTag key={selectOption.Id} color={selectOption.Color}>
              {selectOption.Name}
            </FieldTag>
          );
        })}
      </Space>
    );
  }
  return null;
};
