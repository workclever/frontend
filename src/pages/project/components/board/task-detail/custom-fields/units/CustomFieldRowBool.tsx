import { InputRef } from "antd";
import React from "react";
import { CustomField } from "@app/types/CustomField";
import Field from "@ant-design/pro-field";

export const CustomFieldRowBool: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: boolean;
  onUpdateValue: (newValue: boolean) => void;
  onBlur: () => void;
}> = ({ loading, fieldValue, onUpdateValue, onBlur }) => {
  fieldValue = fieldValue || false;
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
      onBlur();
    }
    // We intentionally trigger `onUpdateValue` only when `tempValue` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempValue]);

  return (
    <Field
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value={fieldValue === "true" || fieldValue === true}
      valueType="switch"
      mode={"edit"}
      onChange={setTempValue}
      fieldProps={{ width: "100%", onBlur, disabled: loading, ref }}
    />
  );
};
