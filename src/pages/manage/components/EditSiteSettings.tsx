import {
  useGetSiteSettingsQuery,
  useGetTimeZonesQuery,
  useUpdateSiteSettingMutation,
} from "../../../services/api";
import { ProDescriptions } from "@ant-design/pro-components";
import { Title } from "../../../components/shared/primitives/Title";

const dateFormats = {
  "dd/MM/yyyy": "dd/MM/yyyy",
  "MM/dd/yyyy": "MM/dd/yyyy",
};

const dateTimeFormats = {
  "yyyy-MM-dd H:mm:ss": "24hr",
  "yyyy-MM-dd h:mm:ss": "12hr",
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
    <>
      <Title level={5}>Site settings</Title>
      <ProDescriptions
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
    </>
  );
};
