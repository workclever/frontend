import { Dropdown } from "antd";
import React from "react";
import { EllipsisIcon } from "lucide-react";

export type EnhancedDropdownMenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

export type EnhancedDropdownMenuProps = {
  items: EnhancedDropdownMenuItem[];
  defaultSelectedKeys?: string[];
  triggerElement?: React.ReactNode;
  triggers?: ("click" | "hover" | "contextMenu")[];
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
      menu={{
        items,
        defaultSelectedKeys,
      }}
      placement="bottomRight"
      destroyPopupOnHide
    >
      {triggerElement ? triggerElement : <EllipsisIcon size={12} />}
    </Dropdown>
  );
};
