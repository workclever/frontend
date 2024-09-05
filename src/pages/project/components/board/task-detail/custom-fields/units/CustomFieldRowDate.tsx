import { InputRef } from "antd";
import React from "react";
import { CustomField } from "@app/types/CustomField";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export const CustomFieldRowDate: React.FC<{
  loading: boolean;
  field: CustomField;
  fieldValue?: string;
  onUpdateValue: (newValue: string) => void;
  onBlur: () => void;
}> = ({ loading, fieldValue, onUpdateValue, onBlur }) => {
  fieldValue = fieldValue || "";
  const ref = React.useRef<InputRef>();

  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  const computedFieldValue = () => {
    if (fieldValue) {
      if (fieldValue === "null" || fieldValue === "Invalid date") {
        return dayjs();
      }

      return dayjs(fieldValue);
    }

    return dayjs();
  };

  return (
    <>
      <DatePicker
        value={computedFieldValue()}
        onChange={(_date, dateStr) => {
          console.log({ dateStr });
          onUpdateValue(String(dateStr));
          onBlur();
        }}
        width={"100%"}
        onBlur={() => {
          // onBlur gets called incorrectly when user makes a date selection
          // so we call onBlur when `onOpenChange` changes to false
        }}
        onOpenChange={(open) => {
          if (!open) {
            onBlur();
          }
        }}
        disabled={loading}
        autoFocus
        needConfirm
        getPopupContainer={() => document.body}
        size="small"
      />
    </>
  );
};
