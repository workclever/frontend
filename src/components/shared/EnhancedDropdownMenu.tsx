import { Dropdown, Menu } from "antd";
import { ItemType } from "antd/es/menu/interface";
import React from "react";
import { DropdownProps } from "./primitives/Dropdown";
import { EllipsisIcon } from "lucide-react";

export type EnhancedDropdownMenuProps = {
  items: ItemType[];
  defaultSelectedKeys?: string[];
  triggerElement?: React.ReactNode;
  triggers?: DropdownProps["trigger"];
};

export const EnhancedDropdownMenu: React.FC<EnhancedDropdownMenuProps> = ({
  items,
  triggerElement,
  triggers,
  defaultSelectedKeys,
}) => {
  return (
    <Dropdown
      trigger={triggers ? triggers : ["hover"]}
      overlay={<Menu items={items} defaultSelectedKeys={defaultSelectedKeys} />}
      placement="bottomRight"
      destroyPopupOnHide
    >
      {triggerElement ? triggerElement : <EllipsisIcon size={12} />}
    </Dropdown>
  );
};
