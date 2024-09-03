import { ProDescriptions } from "@ant-design/pro-components";
import { UploadAvatarButton } from "./UploadAvatarButton";
import { useMe } from "../../hooks/useMe";
import {
  useUpdateUserMutation,
  useUpdateUserPreferenceMutation,
  useGetTimeZonesQuery,
} from "../../services/api";

export const Account = () => {
  const { me } = useMe();
  const [updateUser] = useUpdateUserMutation();
  const [updateUserPreference] = useUpdateUserPreferenceMutation();
  const { data: tz } = useGetTimeZonesQuery(null);
  const tzOptions = (tz?.Data || []).map((r) => ({
    label: r,
    value: r,
  }));

  return (
    <>
      <ProDescriptions
        column={1}
        bordered
        labelStyle={{ width: 150 }}
        size="small"
        editable={{
          type: "multiple",
          onSave: async (keypath, newInfo) => {
            console.log({ keypath, newInfo });
            if (keypath === "FullName") {
              updateUser({
                UserId: Number(me?.Id),
                FullName: newInfo.FullName,
              });
            }
            if (keypath === "Timezone") {
              updateUserPreference({
                Property: "Timezone",
                Value: newInfo.Timezone,
              });
            }
            return true;
          },
        }}
      >
        <ProDescriptions.Item
          title="Avatar"
          valueType={"text"}
          editable={false}
        >
          <UploadAvatarButton />
        </ProDescriptions.Item>

        <ProDescriptions.Item
          title="Full name"
          dataIndex={"FullName"}
          valueType="text"
        >
          {me?.FullName}
        </ProDescriptions.Item>

        <ProDescriptions.Item
          title="Timezone"
          dataIndex={"Timezone"}
          fieldProps={{
            options: tzOptions,
            showSearch: true,
          }}
          valueType="select"
        >
          {me?.Preferences.Timezone}
        </ProDescriptions.Item>
      </ProDescriptions>
    </>
  );
};
