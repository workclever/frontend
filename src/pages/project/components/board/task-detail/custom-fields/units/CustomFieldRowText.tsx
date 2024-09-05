import { InputRef, Input } from "antd";
import React from "react";
import { CustomField } from "@app/types/CustomField";

export const CustomFieldRowText: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: string | number;
  onUpdateValue: (newValue: string | number) => void;
  onBlur: () => void;
  inputType: "text" | "number";
}> = ({ fieldValue, onUpdateValue, inputType, onBlur }) => {
  fieldValue = fieldValue || "";
  const [tempValue, setTempValue] = React.useState(fieldValue);
  const ref = React.useRef<InputRef>();
  const originalValue = React.useRef(fieldValue);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  React.useEffect(() => {
    if (tempValue !== fieldValue) {
      onUpdateValue(tempValue);
    }
    // We intentionally trigger `onUpdateValue` only when `tempValue` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempValue]);

  return (
    <Input
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref={ref}
      placeholder="..."
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      type={inputType}
      style={{ width: "100%" }}
      onBlur={onBlur}
      onPressEnter={onBlur}
      size="small"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onUpdateValue(originalValue.current);
          onBlur();
        }
      }}
    />
  );
};
