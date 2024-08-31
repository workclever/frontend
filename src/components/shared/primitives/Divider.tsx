import { blue } from "@ant-design/colors";

type Props = {
  style?: React.CSSProperties;
};

export const Divider: React.FC<Props> = ({ style }) => (
  <div
    style={{ ...style, width: "100%", borderBottom: `1px solid ${blue[0]}` }}
  />
);
