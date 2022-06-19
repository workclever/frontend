import { Dropdown as AntdDropdown } from "antd";

declare const Placements: [
  "topLeft",
  "topCenter",
  "topRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
  "top",
  "bottom"
];
declare type Placement = typeof Placements[number];

export type DropdownProps = {
  trigger?: ("click" | "hover" | "contextMenu")[];
  overlay: React.ReactElement;
  placement?: Placement;
  children?: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  placement,
  overlay,
  children,
}) => {
  return (
    <AntdDropdown
      overlay={overlay}
      trigger={trigger}
      destroyPopupOnHide
      placement={placement}
    >
      {children}
    </AntdDropdown>
  );
};
