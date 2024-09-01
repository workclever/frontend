import Sider from "antd/lib/layout/Sider";
import React from "react";
import { Tabs, TabPane } from "./primitives/Tabs";
import Menu, { MenuProps } from "antd/lib/menu";
import { ItemType } from "antd/lib/menu/interface";

type Props = {
  menuItems: MenuProps["items"];
  components: { [menuKey: string]: React.FC };
  mode: "menu" | "tab";
};

export const MasterDetail: React.FC<Props> = ({
  menuItems,
  components,
  mode,
}) => {
  const firstItem = menuItems ? menuItems[0] : undefined;
  const [selectedKey, setSelectedKey] = React.useState<React.Key | undefined>(
    firstItem?.key
  );
  const Component = selectedKey ? components[selectedKey] : null;

  if (mode === "menu") {
    return (
      <div style={{ height: "100%" }}>
        <div
          style={{
            padding: 0,
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          <Sider width={250}>
            <Menu
              mode="inline"
              defaultSelectedKeys={selectedKey ? [selectedKey.toString()] : []}
              style={{ height: "100%" }}
              items={menuItems}
              onClick={({ key }) => setSelectedKey(key)}
            />
          </Sider>
          <div
            style={{
              padding: 16,
              minHeight: 280,
              flex: 1,
            }}
          >
            {Component && <Component />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 8, minHeight: 280 }}>
      <Tabs
        defaultActiveKey={selectedKey?.toString()}
        onChange={setSelectedKey}
      >
        {menuItems?.map((r: ItemType) => (
          <TabPane tab={r && "label" in r ? r.label : r?.key} key={r?.key}>
            {Component && <Component />}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
