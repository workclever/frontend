import { Layout, Menu, MenuProps } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React from "react";
import { Tabs, TabPane } from "./primitives/Tabs";

type Props = {
  menuItems: MenuProps["items"];
  components: { [menuKey: string]: any };
  mode: "menu" | "tab";
};

export const MasterDetail: React.FC<Props> = ({
  menuItems,
  components,
  mode,
}) => {
  const firstItem = menuItems ? menuItems[0] : undefined;
  const [selectedKey, setSelectedKey] = React.useState<any>(firstItem?.key);
  const Component = components[selectedKey];

  if (mode === "menu") {
    return (
      <Layout style={{ height: "100%" }}>
        <Content style={{ padding: 0 }}>
          <Layout
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
                defaultSelectedKeys={[selectedKey]}
                style={{ height: "100%" }}
                items={menuItems}
                onClick={({ key }) => setSelectedKey(key)}
              />
            </Sider>
            <Content
              style={{
                padding: 16,
                minHeight: 280,
              }}
            >
              {Component && <Component />}
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: 8, minHeight: 280 }}>
        <Tabs defaultActiveKey={selectedKey} onChange={setSelectedKey}>
          {menuItems?.map((r) => (
            <TabPane tab={(r as any).label} key={r?.key}>
              {Component && <Component />}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};
