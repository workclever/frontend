import React from "react";
import {
  useDeleteProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from "../../../../services/api";
import { HttpResult } from "../../../../components/shared/HttpResult";
import { FormItemProps, ProDescriptions } from "@ant-design/pro-components";
import { omit } from "lodash";
import { BaseOutput } from "../../../../types/BaseOutput";
import { Confirm } from "../../../../components/shared/Confirm";
import { useSelector } from "react-redux";
import { selectSelectedProjectId } from "../../../../slices/project/projectSlice";
import { Button } from "../../../../components/shared/primitives/Button";
import { Space } from "../../../../components/shared/primitives/Space";
import { Divider } from "../../../../components/shared/primitives/Divider";

export const ProjectMeta: React.FC = () => {
  const projectId = Number(useSelector(selectSelectedProjectId));
  const { data, error } = useGetProjectQuery(projectId);
  const project = data?.Data;
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updatedProps, setUpdatedProps] = React.useState<{
    [prop: string]: {
      Result: BaseOutput<any>;
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
      // TODO placeholder doesn't exist on FormItemProps type
      // placeholder: field,
    };
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <HttpResult error={error} />
      <ProDescriptions
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
                [propKey]: newInfo[propKey],
              }).unwrap();

              setUpdatedProps({
                ...updatedProps,
                [propKey]: {
                  Result: result,
                },
              });
              return true;
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
        <ProDescriptions.Item label="Id">{project?.Id}</ProDescriptions.Item>
        <ProDescriptions.Item
          title="Name"
          dataIndex={"Name"}
          valueType="text"
          fieldProps={{
            status: getFieldStatus("Name"),
            placeholder: "Name",
          }}
          formItemProps={getFormItemProps("Name") as any}
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
          formItemProps={getFormItemProps("Slug") as any}
        >
          {project?.Slug}
        </ProDescriptions.Item>
      </ProDescriptions>
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
