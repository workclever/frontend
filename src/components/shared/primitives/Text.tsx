import { gray } from "@ant-design/colors";
import { Typography } from "antd";

type Props = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: React.CSSProperties;
  strong?: boolean;
  onClick?: () => void;
};

export const Text: React.FC<Props> = ({ children, strong, style, onClick }) => {
  style = style || {};
  style = {
    ...style,
    color: style.color || gray[9],
  };
  return (
    <Typography.Text strong={strong} style={style} onClick={onClick}>
      {children}
    </Typography.Text>
  );
};
