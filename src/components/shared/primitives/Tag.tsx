import { Tag as AntdTag } from "antd";

type Props = {
  color?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Tag: React.FC<Props> = ({ color, style, children }) => (
  <AntdTag color={color} style={style}>
    {children}
  </AntdTag>
);
