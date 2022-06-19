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
  children: any;
  placement?: TooltipPlacement;
};

// TODO: Fix tooltip is not visible with <Button>
export const Tooltip: React.FC<Props> = ({ title, children, placement }) => {
  return (
    <AntdTooltip title={title} placement={placement}>
      {children}
    </AntdTooltip>
  );
};
