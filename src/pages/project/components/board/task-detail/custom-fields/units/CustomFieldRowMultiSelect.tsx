import { Select } from "antd";
import React from "react";
import { CustomField } from "../../../../../../../types/CustomField";
import { ColorPicker } from "../../../../../../../components/shared/ColorPicker";
import { Space } from "../../../../../../../components/shared/primitives/Space";

export const CustomFieldRowMultiSelect: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue: number[];
  onUpdateValue: (newValue: number[]) => void;
  onBlur: () => void;
}> = ({ field, fieldValue, onUpdateValue, loading, onBlur }) => {
  const [tempValue, setTempValue] = React.useState(fieldValue || undefined);

  React.useEffect(() => {
    if (tempValue !== fieldValue && tempValue) {
      onUpdateValue(tempValue.filter(Boolean));
    }
  }, [tempValue]);

  return (
    <Select
      placeholder="..."
      value={tempValue}
      onChange={setTempValue}
      style={{ width: "100%" }}
      mode="multiple"
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
