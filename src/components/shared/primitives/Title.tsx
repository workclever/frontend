import { Typography } from "antd";

type Props = {
  children: any;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: React.CSSProperties;
};

export const Title: React.FC<Props> = ({ children, level, style }) => {
  style = style || {};
  style = {
    ...style,
    color: "var(--mauve12)",
  };
  return (
    <Typography.Title level={level} style={style}>
      {children}
    </Typography.Title>
  );
};
