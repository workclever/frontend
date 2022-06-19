import { Popover as AntdPopover } from "antd";

export const Popover: React.FC<{
  content?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ content, children }) => (
  <AntdPopover content={content} trigger="click">
    {children}
  </AntdPopover>
);
