import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { useAppNavigate } from "../../../hooks/useAppNavigate";
import { useCreateProjectMutation } from "../../../services/api";
import { HttpResult } from "../../../components/shared/HttpResult";

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
      />
      <ProFormText
        name="Slug"
        label="Slug"
        placeholder="Project Slug"
        rules={[
          {
            required: true,
            message: "Max length is 4, min length is 1 character",
            max: 4,
            min: 1,
          },
        ]}
      />
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
