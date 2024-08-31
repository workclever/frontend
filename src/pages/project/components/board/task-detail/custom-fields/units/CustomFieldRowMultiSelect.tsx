import React from "react";
import { CustomField } from "../../../../../../../types/CustomField";
import { ColorPicker } from "../../../../../../../components/shared/ColorPicker";
import AtlasKitSelect from "@atlaskit/select";
import { styled } from "styled-components";

const CustomOptionWrapper = styled.div`
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;

  &:hover {
    background-color: #fafafa;
    cursor: pointer;
  }
`;

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
    <AtlasKitSelect
      placeholder="..."
      value={field.SelectOptions?.filter((r) => fieldValue?.includes(r.Id)).map(
        (r) => ({
          label: r.Name,
          value: r.Id,
        })
      )}
      onChange={(value) => setTempValue(value.map((r) => r.value))}
      isLoading={loading}
      isMulti
      onBlur={onBlur}
      autoFocus
      defaultMenuIsOpen
      // zIndex has to be higher than Modal to be visible
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        container: (base) => ({ ...base, width: "100%" }),
      }}
      options={field.SelectOptions?.map((r) => {
        return { value: r.Id, label: r.Name };
      })}
      components={{
        Option: (props) => (
          <CustomOptionWrapper onClick={() => props.selectOption(props.data)}>
            <ColorPicker
              value={
                field.SelectOptions?.find((r) => r.Id === props.data.value)
                  ?.Color
              }
              previewOnly
            />
            <span>{props.data.label}</span>
          </CustomOptionWrapper>
        ),
      }}
    />
  );
};
