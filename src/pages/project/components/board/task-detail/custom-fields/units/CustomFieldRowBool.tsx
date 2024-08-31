import React from "react";
import { CustomField } from "../../../../../../../types/CustomField";
import { Checkbox as AtlasKitCheckbox } from "@atlaskit/checkbox";

export const CustomFieldRowBool: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: boolean;
  onUpdateValue: (newValue: boolean) => void;
  onBlur: () => void;
}> = ({ loading, fieldValue, onUpdateValue, onBlur }) => {
  fieldValue = fieldValue || false;
  const [tempValue, setTempValue] = React.useState(fieldValue);

  React.useEffect(() => {
    if (tempValue !== fieldValue) {
      onUpdateValue(tempValue);
    }
  }, [tempValue]);

  console.log({ fieldValue });

  return (
    <AtlasKitCheckbox
      // Field value can be true or 'true' due to how it's kept in DB
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isChecked={fieldValue == "true" || fieldValue === true}
      onChange={(r) => {
        setTempValue(r.target.checked);
        // When user selects a date we close the datePicker, in any case user have weird interaction so this is good of bad
        setTimeout(onBlur, 0);
      }}
      onBlur={onBlur}
      isDisabled={loading}
      autoFocus
    />
  );
};
