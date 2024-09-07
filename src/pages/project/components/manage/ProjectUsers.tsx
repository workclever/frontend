import { Table, Switch, Tooltip } from "antd";
import React from "react";
import { useMe } from "@app/hooks/useMe";
import {
  useListProjectUsersQuery,
  useCreateProjectAssigneeMutation,
  useRemoveProjectAssigneeMutation,
  useCreateManagerUserForProjectMutation,
  useDeleteManagerUserForProjectMutation,
  useListProjectUserAccessesQuery,
} from "@app/services/api";
import { BasicUserOutput } from "@app/types/Project";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { Confirm } from "@app/components/shared/Confirm";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { UserSelector } from "../shared/UserSelector";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";

export const ProjectUsers: React.FC<{ projectId: number }> = ({
  projectId,
}) => {
  const { isAdmin, isMe } = useMe();
  const { data: projectUsers, refetch: refetchProjectUsers } =
    useListProjectUsersQuery(projectId);
  const { data: accessedUsers, refetch: refetchAccessedUsers } =
    useListProjectUserAccessesQuery({
      projectId,
      entityClass: EntityClasses.Project,
    });
  const accessedUsersData = accessedUsers?.Data || [];

  const [createAssignee] = useCreateProjectAssigneeMutation();
  const [removeAssignee] = useRemoveProjectAssigneeMutation();

  const [createManager] = useCreateManagerUserForProjectMutation();
  const [deleteManager] = useDeleteManagerUserForProjectMutation();

  const columns = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "Id",
    },
    {
      title: "Full Name",
      dataIndex: "",
      key: "FullName",
      render: (item: BasicUserOutput) => {
        return (
          <>
            <Space>
              <UserAvatar userId={item.Id} />
              {item.FullName}
            </Space>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Can manage project?",
      dataIndex: "",
      key: "Read",
      render: (item: BasicUserOutput) => {
        const hasManagePermission = Boolean(
          accessedUsersData.find(
            (r) =>
              r.Permission === Permissions.CanManageProject &&
              r.UserId === item.Id
          )
        );
        return (
          <Switch
            checked={hasManagePermission}
            disabled={isMe(item.Id)}
            onChange={async (e) => {
              if (e) {
                await createManager({
                  ProjectId: projectId,
                  UserId: item.Id,
                });
              } else {
                await deleteManager({
                  ProjectId: projectId,
                  UserId: item.Id,
                });
              }
              refetchProjectUsers();
            }}
          ></Switch>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "Read",
      render: (item: BasicUserOutput) => {
        const canUnAssign = isAdmin || !isMe(item.Id);
        return (
          <Tooltip
            title={
              canUnAssign
                ? "Remove this user from the project"
                : "You can't unassign yourself"
            }
          >
            <Button
              disabled={!canUnAssign}
              danger
              size="small"
              onClick={() => {
                Confirm.Show({
                  title: "Are you sure to unassign this person from project?",
                  content: "You will need to assign again.",
                  onConfirm: async () => {
                    await removeAssignee({
                      ProjectId: projectId,
                      Ids: [{ UserId: item.Id }],
                    });
                    await deleteManager({
                      ProjectId: projectId,
                      UserId: item.Id,
                    });
                    refetchProjectUsers();
                  },
                });
              }}
            >
              Unassign
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  const [newUserId, setNewUserId] = React.useState(0);

  return (
    <>
      <Space direction="vertical">
        <div style={{ width: 180 }}>
          <UserSelector
            title="Add a new user to the project"
            selectedUserIds={[newUserId]}
            selectedProjectId={projectId}
            onChange={(userIds) => {
              setNewUserId(Number(userIds) || 0);
            }}
            loading={false}
            withAllUsers
          />
        </div>
        <Button
          disabled={!newUserId}
          type="primary"
          onClick={async () => {
            if (newUserId) {
              await createAssignee({
                ProjectId: projectId,
                Ids: [{ UserId: newUserId }],
              });
              refetchProjectUsers();
              refetchAccessedUsers();
            }
          }}
        >
          Add to project
        </Button>
      </Space>
      <Divider />
      <Table
        rowKey="Id"
        columns={columns}
        dataSource={projectUsers?.Data || []}
        size="small"
      />
    </>
  );
};
