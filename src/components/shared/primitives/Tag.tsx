import { Tag as AntdTag } from "antd";

type Props = {
  color?: any;
  style?: React.CSSProperties;
  children?: any;
};

export const Tag: React.FC<Props> = ({ color, style, children }) => (
  <AntdTag color={color} style={style}>
    {children}
  </AntdTag>
);
