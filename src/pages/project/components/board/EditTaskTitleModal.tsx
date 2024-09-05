import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { HttpResult } from "@app/components/shared/HttpResult";
import { useUpdateTaskPropertyMutation } from "@app/services/api";
import { TaskType } from "@app/types/Project";

type FormValuesType = {
  Title: string;
};

export const EditTaskTitleModal: React.FC<{
  task: TaskType;
  onCancel: () => void;
}> = ({ task, onCancel }) => {
  const [update, { error, data }] = useUpdateTaskPropertyMutation();

  const onFinish = (values: FormValuesType) => {
    update({
      Task: task,
      Params: {
        property: "Title",
        value: values.Title,
      },
    });
  };

  return (
    <ModalForm<FormValuesType>
      title={"Edit task title"}
      open
      autoFocusFirstInput
      modalProps={{
        width: 300,
        cancelText: "Cancel",
        okText: "Save",
        onCancel,
      }}
      initialValues={{
        Title: task.Title,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="Title"
          label="Name"
          placeholder="Task title"
          rules={[{ required: true, message: "Title" }]}
        />
      </ProForm.Group>
      <HttpResult error={error} result={data} />
    </ModalForm>
  );
};
