import { Select, SelectProps } from "antd";
import React from "react";
import {
  useListAllUsersQuery,
  useListProjectUsersQuery,
} from "@app/services/api";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { DefaultOptionType } from "antd/lib/select";

type Props = {
  title: string;
  selectedUserIds: number[];
  selectedProjectId: number;
  loading: boolean;
  onChange: (userId: number[]) => void;
  disabled?: boolean;
  withAllUsers?: boolean;
  mode?: SelectProps["mode"];
};

export const UserSelector: React.FC<Props> = ({
  title,
  selectedUserIds,
  selectedProjectId,
  loading,
  onChange,
  disabled,
  withAllUsers,
  mode,
}) => {
  const { data: users } = useListProjectUsersQuery(Number(selectedProjectId), {
    skip: !selectedProjectId,
  });
  const { data: allUsers } = useListAllUsersQuery(null);
  const computedUsers = withAllUsers ? allUsers?.Data || [] : users?.Data || [];

  // Update when renderer changed
  const onFilter = (input: string, option: DefaultOptionType) => {
    const spanPath =
      option && option.children ? option.children[1].props.children : "";
    return spanPath.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const onChangeLocal = (value: number[]) => {
    onChange(value);
  };

  const getValue = () => {
    return !selectedUserIds ||
      selectedUserIds.length === 0 ||
      (selectedUserIds.length === 1 && selectedUserIds[0] === 0)
      ? undefined
      : selectedUserIds;
  };

  const withOnlyAvatar = selectedUserIds?.length > 1;

  return (
    <div>
      <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>
        {title}
      </div>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="User select"
        value={getValue()}
        onChange={onChangeLocal}
        allowClear={selectedUserIds?.length > 0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterOption={onFilter}
        loading={loading}
        disabled={loading || disabled}
        mode={mode}
        tagRender={
          withOnlyAvatar
            ? (value) => {
                return <UserAvatar userId={value.value} />;
              }
            : undefined
        }
      >
        {[...computedUsers].map((user) => (
          // Update onFilter when renderer changed
          <Select.Option key={user.Id} value={user.Id}>
            <UserAvatar userId={user.Id} />
            <span style={{ marginLeft: 8 }}>{user.FullName}</span>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
