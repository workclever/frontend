import { Tooltip as AntdTooltip } from "antd";

type TooltipPlacement =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

type Props = {
  title?: string;
  children: React.ReactNode;
  placement?: TooltipPlacement;
};

export const Tooltip: React.FC<Props> = ({ title, children, placement }) => {
  return (
    <AntdTooltip title={title} placement={placement}>
      {children}
    </AntdTooltip>
  );
};
