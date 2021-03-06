import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import React from "react";
import { DropdownProps } from "./primitives/Dropdown";

export const EnhancedDropdownMenu: React.FC<{
  items: ItemType[];
  defaultSelectedKeys?: string[];
  triggerElement?: React.ReactElement;
  triggers?: DropdownProps["trigger"];
}> = ({ items, triggerElement, triggers, defaultSelectedKeys }) => {
  return (
    <Dropdown
      trigger={triggers ? triggers : ["hover"]}
      overlay={<Menu items={items} defaultSelectedKeys={defaultSelectedKeys} />}
      placement="bottomRight"
      destroyPopupOnHide
    >
      {triggerElement ? triggerElement : <EllipsisOutlined />}
    </Dropdown>
  );
};
