import { Space as AntdSpace } from "antd";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  size?: "small" | "middle" | "large";
  direction?: "horizontal" | "vertical";
  align?: "start" | "end" | "center" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
};

export const Space: React.FC<Props> = ({
  style,
  direction,
  children,
  size,
  wrap,
  align,
  fullWidth,
}) => (
  <AntdSpace
    style={{ ...(fullWidth ? { width: "100%" } : {}), ...style }}
    direction={direction}
    size={size}
    wrap={wrap}
    align={align}
  >
    {children}
  </AntdSpace>
);
