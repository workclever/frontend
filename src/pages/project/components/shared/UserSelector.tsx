import { Select } from "antd";
import React from "react";
import { useProjectUsers } from "../../../../hooks/useProjectUsers";
import { useListAllUsersQuery } from "../../../../services/api";
import { UserAvatar } from "../../../../components/shared/UserAvatar";
import { Text } from "../../../../components/shared/primitives/Text";

type Props = {
  title: string;
  selectedUserId: number;
  loading: boolean;
  onChange: (userId: number) => void;
  disabled?: boolean;
  withAllUsers?: boolean;
  unSelectedText: string;
};

export const UserSelector: React.FC<Props> = ({
  title,
  selectedUserId,
  loading,
  onChange,
  disabled,
  withAllUsers,
  unSelectedText,
}) => {
  const { users } = useProjectUsers();
  const { data: allUsers } = useListAllUsersQuery(null);
  const computedUsers = withAllUsers ? allUsers?.Data || [] : users;

  // Update when renderer changed
  const onFilter = (input: string, option: any) => {
    const spanPath = option.children[1].props.children;
    return spanPath.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <div>
      <Text>{title}</Text>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="User select"
        value={selectedUserId}
        onChange={(value) => onChange(value || 0)}
        allowClear={selectedUserId !== 0}
        onClear={() => onChange && onChange(0)}
        filterOption={onFilter}
        loading={loading}
        disabled={loading || disabled}
        showArrow={!disabled}
      >
        {[{ Id: 0, FullName: unSelectedText }, ...computedUsers].map((user) => (
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
