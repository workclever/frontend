import { InputRef } from "antd";
import React from "react";
import { CustomField } from "@app/types/CustomField";
import Field from "@ant-design/pro-field";

// TODO: fix onBlur not working
export const CustomFieldRowDate: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: string;
  onUpdateValue: (newValue: string) => void;
  onBlur: () => void;
}> = ({ loading, fieldValue, onUpdateValue, onBlur }) => {
  fieldValue = fieldValue || "";
  const [tempValue, setTempValue] = React.useState(fieldValue);
  const ref = React.useRef<InputRef>();

  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  React.useEffect(() => {
    if (tempValue !== fieldValue) {
      onUpdateValue(tempValue);
    }
  }, [tempValue]);

  const computedFieldValue = () => {
    if (fieldValue) {
      if (fieldValue === "null" || fieldValue === "Invalid date") {
        return new Date();
      }

      return new Date(fieldValue);
    }

    return new Date();
  };

  return (
    <Field
      value={computedFieldValue()}
      valueType="date"
      mode={"edit"}
      onChange={(e) => setTempValue(e)}
      fieldProps={{ width: "100%", onBlur, disabled: loading, autoFocus: true }}
    />
  );
};
