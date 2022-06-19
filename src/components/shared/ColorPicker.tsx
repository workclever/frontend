import styled from "styled-components";
import { colors, PresetColor } from "./colors";
import { Popover } from "./primitives/Popover";
import Circle from "react-color/lib/components/circle/Circle";

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const ColorPicker: React.FC<{
  value?: PresetColor;
  onChange?: (color: string) => void;
  previewOnly?: boolean;
}> = ({ value, onChange, previewOnly }) => {
  const preview = () => (
    <ColorPreview
      style={{
        backgroundColor: value,
      }}
    >
      &nbsp;
    </ColorPreview>
  );

  if (previewOnly) {
    return preview();
  }

  return (
    <Popover
      content={
        <Circle
          width="213px"
          // TODO: map better
          colors={colors}
          color={value}
          onChange={(e: any) => {
            onChange && onChange(e.hex);
          }}
        />
      }
    >
      {preview()}
    </Popover>
  );
};
