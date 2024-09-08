import { AppEditor } from "@app/components/shared/editor/AppEditor";
import { HttpResult } from "@app/components/shared/HttpResult";
import { Button } from "@app/components/shared/primitives/Button";
import {
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
} from "@app/services/api";
import { TaskType, TaskCommentType } from "@app/types/Project";
import { Form } from "antd";
import React from "react";

type FormValuesType = {
  content: string;
};

export const TaskCommentEditor: React.FC<{
  task: TaskType;
  mode: "create" | "update";
  comment?: TaskCommentType;
  onEditDone?: () => void;
}> = ({ task, mode, comment, onEditDone }) => {
  const [initialValues, setInitialValues] = React.useState({
    content: comment ? comment.Content : "",
  });
  const [createComment, { isLoading: createLoading, error: createError }] =
    useCreateTaskCommentMutation();
  const [updateComment, { isLoading: updateLoading, error: updateError }] =
    useUpdateTaskCommentMutation();
  const isLoading = createLoading || updateLoading;

  const [form] = Form.useForm();

  const onFinish = async (params: FormValuesType) => {
    if (mode === "create") {
      await createComment({
        Content: params.content,
        TaskId: task.Id,
      });
    } else if (mode === "update") {
      await updateComment({
        CommentId: Number(comment?.Id),
        Content: params.content,
        TaskId: task.Id,
      });
      if (onEditDone) {
        onEditDone();
      }
    }
    setInitialValues({ content: "" });
    form.resetFields();
  };

  return (
    <>
      <Form<FormValuesType>
        initialValues={initialValues}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        size="small"
      >
        <Form.Item
          name="content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <AppEditor
            showToolbar={true}
            initialViewMode={"editing"}
            height={100}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {mode === "create" ? "Comment" : "Update"}
          </Button>
        </Form.Item>
        <div style={{ marginTop: 4 }}>
          <HttpResult error={createError || updateError} />
        </div>
      </Form>
    </>
  );
};
