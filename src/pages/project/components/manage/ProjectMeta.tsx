import React from "react";
import {
  useDeleteProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from "@app/services/api";
import { HttpResult } from "@app/components/shared/HttpResult";
import { FormItemProps, ProDescriptions } from "@ant-design/pro-components";
import { omit } from "lodash";
import { BaseOutput } from "@app/types/BaseOutput";
import { Confirm } from "@app/components/shared/Confirm";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";
import { ProjectType } from "@app/types/Project";
import { Alert } from "@app/components/shared/primitives/Alert";

export const ProjectMeta: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { data, error } = useGetProjectQuery(projectId);
  const project = data?.Data;
  const [updateProject, { data: updateResult }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updatedProps, setUpdatedProps] = React.useState<{
    [prop: string]: {
      Result: BaseOutput<string>;
    };
  }>({});

  const getFieldStatus = (field: string) => {
    const obj = updatedProps[field];
    if (!obj || obj.Result.Succeed) {
      return undefined;
    }
    return "error";
  };

  const getFormItemProps = (field: string): FormItemProps | undefined => {
    const obj = updatedProps[field];
    if (!obj || obj.Result.Succeed) {
      return undefined;
    }
    return {
      validateStatus: "error",
      help: obj.Result.Message,
    };
  };

  return (
    <Space direction="vertical" fullWidth>
      <Alert type="info" message="Update your projects meta configuration." />
      <ProDescriptions<ProjectType>
        column={1}
        bordered
        size="small"
        labelStyle={{ width: 150 }}
        editable={{
          type: "multiple",
          onSave: async (keypath, newInfo) => {
            const propKey = keypath as string;
            try {
              const result = await updateProject({
                ProjectId: projectId,
                ...omit(project, "Id"),
                [propKey]: newInfo[propKey as keyof ProjectType],
              }).unwrap();

              setUpdatedProps({
                ...updatedProps,
                [propKey]: {
                  Result: result,
                },
              });
              return true;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              setUpdatedProps({
                ...updatedProps,
                [propKey]: {
                  Result: e.data,
                },
              });
              return false;
            }
          },
        }}
      >
        <ProDescriptions.Item label="Id" editable={false}>
          {project?.Id}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          title="Name"
          dataIndex={"Name"}
          valueType="text"
          fieldProps={{
            status: getFieldStatus("Name"),
            placeholder: "Name",
          }}
          formItemProps={getFormItemProps("Name")}
        >
          {project?.Name}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          title="Slug"
          dataIndex={"Slug"}
          valueType="text"
          fieldProps={{
            status: getFieldStatus("Slug"),
            placeholder: "Slug",
          }}
          formItemProps={getFormItemProps("Slug")}
        >
          {project?.Slug}
        </ProDescriptions.Item>
      </ProDescriptions>
      <HttpResult result={updateResult} error={error} />
      <Divider />
      <Confirm.Embed
        title="Delete operation is not recoverable, are you sure?"
        onConfirm={() => {
          deleteProject(projectId);
        }}
      >
        <Button danger size="small">
          Delete project
        </Button>
      </Confirm.Embed>
    </Space>
  );
};
