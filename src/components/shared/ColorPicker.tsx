import styled from "styled-components";
import { colors, PresetColor } from "./colors";
import { Popover } from "./primitives/Popover";

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
        <div style={{ display: "flex", flexWrap: "wrap", width: "120px" }}>
          {colors.map((r) => (
            <ColorPreview
              key={r}
              style={{
                backgroundColor: r,
                marginRight: 4,
                marginBottom: 4,
              }}
              onClick={() => onChange && onChange(r)}
            >
              &nbsp;
            </ColorPreview>
          ))}
        </div>
      }
    >
      {preview()}
    </Popover>
  );
};
