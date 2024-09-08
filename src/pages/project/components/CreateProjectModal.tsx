import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useCreateProjectMutation } from "@app/services/api";
import { HttpResult } from "@app/components/shared/HttpResult";

type CreateProjectModalInput = {
  Name: string;
  Slug: string;
};

export const CreateProjectModal: React.FC<{ onCancel: () => void }> = ({
  onCancel,
}) => {
  const { goToProject } = useAppNavigate();
  const [createProject, { error: createError, data: createResult }] =
    useCreateProjectMutation();

  const onFinish = async (values: CreateProjectModalInput) => {
    const result = await createProject({
      Name: values.Name,
      Slug: values.Slug,
    }).unwrap();
    if (result.Succeed) {
      goToProject(result.Data.Id);
      onCancel();
    }
  };

  return (
    <ModalForm<CreateProjectModalInput>
      title={"Create new project"}
      open
      autoFocusFirstInput
      modalProps={{
        width: 500,
        cancelText: "Cancel",
        okText: "Save",
        onCancel,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProFormText
        name="Name"
        label="Name"
        placeholder="Project name"
        rules={[{ required: true, message: "Name of the project" }]}
        tooltip="Example: 'My project' or 'Payment operations' etc. It's up to you"
        width={200}
      />
      <ProFormText
        name="Slug"
        label="Project identifier"
        placeholder="Project identifier"
        tooltip="Example: MY or TEST. It's a unique identifier among your projects"
        width={200}
        rules={[
          {
            required: true,
            message: "Maximum length is 4, minimum length is 1 character",
            max: 4,
            min: 1,
          },
        ]}
      />
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
