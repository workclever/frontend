import {
  useGetSiteSettingsQuery,
  useGetTimeZonesQuery,
  useUpdateSiteSettingMutation,
} from "@app/services/api";
import { ProDescriptions } from "@ant-design/pro-components";
import { SiteSettings } from "@app/types/SiteSettings";
import { Alert } from "@app/components/shared/primitives/Alert";
import { Space } from "@app/components/shared/primitives/Space";

const dateFormats = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "MM/DD/YYYY": "MM/DD/YYYY",
};

const dateTimeFormats = {
  "DD/MM/YYYY HH:mm": "24hr",
  "DD/MM/YYYY hh:mm": "12hr",
};

export const EditSiteSettings = () => {
  const { data: siteSettings } = useGetSiteSettingsQuery(null);

  const [updateSetting] = useUpdateSiteSettingMutation();
  const { data: tz } = useGetTimeZonesQuery(null);
  const tzOptions = (tz?.Data || []).map((r) => ({
    label: r,
    value: r,
  }));

  if (!siteSettings) {
    return null;
  }

  return (
    <Space direction="vertical" fullWidth>
      <Alert
        type="info"
        message="Update settings for your website. Timezone can be overriden individually by user accounts."
      />
      <ProDescriptions<SiteSettings>
        column={1}
        bordered
        labelStyle={{ width: 150 }}
        editable={{
          type: "multiple",
          onSave: async (keypath, newInfo) => {
            if (keypath === "DefaultTimezone") {
              updateSetting({
                Property: "DefaultTimezone",
                Value: newInfo.DefaultTimezone,
              });
            }
            if (keypath === "DefaultDateTimeFormat") {
              updateSetting({
                Property: "DefaultDateTimeFormat",
                Value: newInfo.DefaultDateTimeFormat,
              });
            }
            if (keypath === "DefaultDateFormat") {
              updateSetting({
                Property: "DefaultDateFormat",
                Value: newInfo.DefaultDateFormat,
              });
            }
            return true;
          },
        }}
      >
        <ProDescriptions.Item
          title="Timezone"
          dataIndex={"DefaultTimezone"}
          fieldProps={{
            options: tzOptions,
          }}
          valueType="select"
        >
          {siteSettings.Data.DefaultTimezone}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          title="Date format"
          dataIndex={"DefaultDateFormat"}
          valueType="select"
          valueEnum={dateFormats}
        >
          {siteSettings.Data.DefaultDateFormat}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          title="Date time format"
          dataIndex={"DefaultDateTimeFormat"}
          valueType="select"
          valueEnum={dateTimeFormats}
        >
          {siteSettings.Data.DefaultDateTimeFormat}
        </ProDescriptions.Item>
      </ProDescriptions>
    </Space>
  );
};
