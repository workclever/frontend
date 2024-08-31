import React from "react";
import { CustomField } from "../../../../../../../types/CustomField";
import { DatePicker as AtlasKitDatePicker } from "@atlaskit/datetime-picker";

// TODO: use SiteSettings `DefaultDateFormat`
export const CustomFieldRowDate: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: string;
  onUpdateValue: (newValue: string) => void;
  onBlur: () => void;
}> = ({ loading, fieldValue, onUpdateValue, onBlur }) => {
  fieldValue = fieldValue || "";
  const [tempValue, setTempValue] = React.useState(fieldValue);

  React.useEffect(() => {
    if (tempValue !== fieldValue) {
      onUpdateValue(tempValue);
    }
  }, [tempValue]);

  const computedFieldValue = () => {
    if (fieldValue) {
      if (fieldValue === "null" || fieldValue === "Invalid date") {
        return new Date().toISOString();
      }

      return new Date(fieldValue).toISOString();
    }

    return new Date().toISOString();
  };

  return (
    <AtlasKitDatePicker
      value={computedFieldValue()}
      onChange={(e) => {
        setTempValue(e);
        // When user selects a date we close the datePicker, in any case user have weird interaction so this is good of bad
        setTimeout(onBlur, 0);
      }}
      onBlur={onBlur}
      isDisabled={loading}
      autoFocus
    />
  );
};
