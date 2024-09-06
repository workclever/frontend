import { Popover as AntdPopover, PopoverProps } from "antd";

export const Popover: React.FC<{
  content?: React.ReactNode;
  children?: React.ReactNode;
  placement?: PopoverProps["placement"];
}> = ({ content, children, placement }) => (
  <AntdPopover content={content} trigger="click" placement={placement}>
    {children}
  </AntdPopover>
);
