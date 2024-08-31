import React from "react";
import { useProjectUsers } from "../../../../hooks/useProjectUsers";
import { useListAllUsersQuery } from "../../../../services/api";
import { Text } from "../../../../components/shared/primitives/Text";
import AtlasKitSelect from "@atlaskit/select";
import { OptionType } from "@atlaskit/select/dist/types";

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
  const onFilter = (option: OptionType, input: string) => {
    const spanPath =
      option && option.children ? option.children[1].props.children : "";
    return spanPath.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const selectedUser = allUsers?.Data.find((r) => r.Id === selectedUserId);

  return (
    <div>
      <Text>{title}</Text>
      <AtlasKitSelect
        showSearch
        styles={{ container: (base) => ({ ...base, width: "150px" }) }}
        placeholder="User select"
        value={{ value: selectedUserId, label: selectedUser?.FullName }}
        onChange={(value) => onChange(value?.value || 0)}
        isClearable={selectedUserId !== 0}
        onClear={() => onChange && onChange(0)}
        filterOption={onFilter}
        isLoading={loading}
        isDisabled={loading || disabled}
        // showArrow={!disabled}
        options={[{ Id: 0, FullName: unSelectedText }, ...computedUsers].map(
          (user) => {
            return { value: user.Id, label: user.FullName };
          }
        )}
      />
    </div>
  );
};
