import { Space } from "@app/components/shared/primitives/Space";
import { Tag } from "@app/components/shared/primitives/Tag";
import { useFormattedDate } from "@app/hooks/useFormattedDate";
import {
  CustomField,
  CustomFieldType,
  CustomFieldValue,
} from "@app/types/CustomField";
import { CheckIcon, XIcon } from "lucide-react";

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

export const CustomFieldPreview: React.FC<{
  customField: CustomField;
  customFieldValue: CustomFieldValue;
}> = ({ customField, customFieldValue }) => {
  const emptyValue = () => (
    <div style={{ height: 25, width: "100%", minWidth: 150 }}>&nbsp;</div>
  );

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
        {customFieldValue ? <CheckIcon size={12} /> : <XIcon size={12} />}
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
