import {
  ProColumns,
  TableDropdown,
  ProTable,
} from "@ant-design/pro-components";
import { uniq } from "lodash";
import React from "react";
import { Button } from "@app/components/shared/primitives/Button";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import {
  useGetUserAssignedProjectIdsQuery,
  useGetUserRolesQuery,
  useListAllUsersQuery,
  useListUserProjectsQuery,
} from "@app/services/api";
import { BasicUserOutput } from "@app/types/Project";
import { CreateUserModal } from "./users/CreateUserModal";
import { EditRolesModal } from "./users/EditRolesModal";
import { EditUserModal } from "./users/EditUserModal";
import { Text } from "@app/components/shared/primitives/Text";
import { Space } from "@app/components/shared/primitives/Space";
import { Alert } from "@app/components/shared/primitives/Alert";

const TableUserDetail: React.FC<{ user: BasicUserOutput }> = ({ user }) => {
  const { data: userAssignedProjectIds } = useGetUserAssignedProjectIdsQuery(
    user.Id
  );
  const { data: userProjects } = useListUserProjectsQuery(null);

  const computedProjects = uniq(userAssignedProjectIds?.Data || [])
    .map((id) => userProjects?.Data.find((r) => r.Id === id))
    .map((r) => r?.Name)
    .join(", ");

  const { data: userRoles } = useGetUserRolesQuery(user.Id);
  const userRolesData = userRoles?.Data || [];

  return (
    <>
      <div>
        Assigned projects:{" "}
        <Text strong>
          {computedProjects.length
            ? computedProjects
            : "No project assigned yet"}
        </Text>
      </div>
      <div>
        Roles:{" "}
        <Text strong>
          {userRolesData.length ? userRolesData : "No roles assigned"}
        </Text>
      </div>
    </>
  );
};

export const Users = () => {
  const { data } = useListAllUsersQuery(null);
  const allUsers = data?.Data || [];
  const [editing, setEditing] = React.useState<BasicUserOutput>();
  const [editingRolesUser, setEditingRolesUser] =
    React.useState<BasicUserOutput>();
  const [creating, setCreating] = React.useState<boolean>(false);

  const columns: ProColumns<BasicUserOutput>[] = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "Id",
      valueType: "text",
    },
    {
      title: "Full Name",
      dataIndex: "",
      key: "FullName",
      render: (_, record) => {
        return (
          <>
            <Space>
              <UserAvatar userId={record.Id} />
              {record.FullName}
            </Space>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      valueType: "text",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      hideInSearch: true,
      render: (_, record) => {
        return (
          <TableDropdown
            key="menu"
            menus={[
              {
                key: "1",
                name: "Edit user",
                onClick: () => setEditing(record),
              },
              {
                key: "2",
                name: "Edit roles",
                onClick: () => setEditingRolesUser(record),
              },
            ]}
          />
        );
      },
    },
  ];

  const [searchFilters, setSearchFilters] =
    React.useState<Partial<BasicUserOutput>>();

  const beforeSearchSubmit = (param: Partial<BasicUserOutput>) => {
    setSearchFilters(param);
  };

  const getDataSource = () => {
    let filteredUsers = allUsers;
    if (searchFilters?.Id) {
      filteredUsers = filteredUsers.filter(
        (r) => r.Id === Number(searchFilters?.Id)
      );
    }
    if (searchFilters?.FullName) {
      const t = searchFilters?.FullName?.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (r) => r.FullName.toLowerCase().indexOf(t) > -1
      );
    }
    if (searchFilters?.Email) {
      const t = searchFilters?.Email?.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (r) => r.Email.toLowerCase().indexOf(t) > -1
      );
    }
    return filteredUsers;
  };

  return (
    <Space direction="vertical" fullWidth>
      <Alert
        type="info"
        message="Manage the users in your site. This list contains all of your users."
      />
      <ProTable
        columns={columns}
        dataSource={getDataSource()}
        rowKey="Id"
        footer={() => (
          <Button type="primary" onClick={() => setCreating(true)}>
            Create new user
          </Button>
        )}
        expandable={{
          expandedRowRender: (record) => <TableUserDetail user={record} />,
          rowExpandable: () => true,
        }}
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          filterType: "light",
        }}
        beforeSearchSubmit={beforeSearchSubmit}
      />
      {editing && (
        <EditUserModal
          editingUser={editing}
          onExit={() => setEditing(undefined)}
        />
      )}
      {creating && <CreateUserModal onExit={() => setCreating(false)} />}
      {editingRolesUser && (
        <EditRolesModal
          editingUser={editingRolesUser}
          onExit={() => setEditingRolesUser(undefined)}
        />
      )}
    </Space>
  );
};
