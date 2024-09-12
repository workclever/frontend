import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { useCreateTaskMutation } from "@app/services/api";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import React from "react";
import { useSelector } from "react-redux";

type FormValuesType = {
  Title: string;
};

export const CreateTaskModal: React.FC<{
  columnId: number;
  onCancel: () => void;
}> = ({ columnId, onCancel }) => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [createTask] = useCreateTaskMutation();

  const onFinish = async (values: FormValuesType) => {
    await createTask({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      ColumnId: columnId,
      Title: values.Title,
      Description: "",
    });
  };

  return (
    <ModalForm<FormValuesType>
      initialValues={{
        Title: "",
      }}
      open
      onFinish={onFinish}
      autoComplete="off"
      modalProps={{
        title: "Create a new task",
        width: 300,
        cancelText: "Cancel",
        okText: "Save",
        onCancel,
      }}
    >
      <ProFormText
        name="Title"
        label="Title"
        placeholder="Create a new task..."
        rules={[{ required: true, message: "Title of the task" }]}
      />
    </ModalForm>
  );
};
