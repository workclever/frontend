import { Select } from "antd";
import React from "react";
import { CustomField } from "@app/types/CustomField";
import { ColorPicker } from "@app/components/shared/ColorPicker";
import { Space } from "@app/components/shared/primitives/Space";

export const CustomFieldRowSelect: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue: number;
  onUpdateValue: (newValue: number) => void;
  onBlur: () => void;
}> = ({ loading, field, fieldValue, onUpdateValue, onBlur }) => {
  const [tempValue, setTempValue] = React.useState(fieldValue);

  React.useEffect(() => {
    if (tempValue !== fieldValue) {
      onUpdateValue(tempValue);
    }
  }, [tempValue]);

  return (
    <Select
      placeholder="..."
      value={tempValue}
      onChange={setTempValue}
      style={{ width: "100%" }}
      loading={loading}
      onBlur={onBlur}
      autoFocus
      defaultOpen
    >
      {field.SelectOptions.map((r) => (
        <Select.Option key={r.Id} value={r.Id}>
          <Space>
            <ColorPicker value={r.Color} previewOnly />
            {r.Name}
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};
