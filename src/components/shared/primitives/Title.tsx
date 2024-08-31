import { gray } from "@ant-design/colors";

type Props = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5; // TODOAK unused
  style?: React.CSSProperties;
};

export const Title: React.FC<Props> = ({ children, style }) => {
  style = style || {};
  style = {
    ...style,
    color: gray[9],
  };
  return <div style={style}>{children}</div>;
};
