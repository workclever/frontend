import React, { ChangeEvent } from "react";
import { CustomField } from "../../../../../../../types/CustomField";
import AtlasKitTextField from "@atlaskit/textfield";

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
  const ref = React.useRef<any>();
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
  }, [tempValue]);

  return (
    <AtlasKitTextField
      ref={ref}
      placeholder="..."
      value={tempValue}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setTempValue(e.target.value)
      }
      type={inputType}
      style={{ width: "100%" }}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onBlur();
        }
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
