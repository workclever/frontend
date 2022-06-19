import { Divider as AntdDivider } from "antd";

type Props = {
  type?: "horizontal" | "vertical";
  orientation?: "left" | "right" | "center";
  style?: React.CSSProperties;
};

export const Divider: React.FC<Props> = ({ type, orientation, style }) => (
  <AntdDivider type={type} orientation={orientation} style={style} />
);
