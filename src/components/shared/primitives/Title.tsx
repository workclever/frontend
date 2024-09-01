import { gray } from "@ant-design/colors";
import { Typography } from "antd";

type Props = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: React.CSSProperties;
};

export const Title: React.FC<Props> = ({ children, level, style }) => {
  style = style || {};
  style = {
    ...style,
    color: gray[9],
  };
  return (
    <Typography.Title level={level} style={style}>
      {children}
    </Typography.Title>
  );
};
