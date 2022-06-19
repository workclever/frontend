import { Space as AntdSpace } from "antd";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "middle" | "large";
  direction?: "horizontal" | "vertical";
  align?: "start" | "end" | "center" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
  children: any;
};

export const Space: React.FC<Props> = ({
  style,
  direction,
  children,
  size,
  wrap,
  align,
}) => (
  <AntdSpace
    style={style}
    direction={direction}
    size={size}
    wrap={wrap}
    align={align}
  >
    {children}
  </AntdSpace>
);
