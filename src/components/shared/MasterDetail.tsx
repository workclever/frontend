import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

export type MasterDetailMetaType = {
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  menuItems: MasterDetailMetaType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: { [menuKey: number]: any };
  mode: "menu" | "tab"; // TODO unused now
};

export const MasterDetail: React.FC<Props> = ({ menuItems, components }) => {
  const [selectedKey, setSelectedKey] = React.useState(0);
  const Component = components[selectedKey];

  return (
    <Layout>
      <Content style={{ padding: 8, minHeight: 280 }}>
        <Tabs onChange={setSelectedKey} selected={selectedKey} id="controlled">
          <TabList>
            {menuItems?.map((r: MasterDetailMetaType) => (
              <Tab key={r?.label}>{r.label}</Tab>
            ))}
          </TabList>
          {menuItems?.map((r: MasterDetailMetaType) => {
            return (
              <TabPanel key={r?.label}>
                <div style={{ width: "100%" }}>
                  {Component && <Component />}
                </div>
              </TabPanel>
            );
          })}
        </Tabs>
      </Content>
    </Layout>
  );
};
