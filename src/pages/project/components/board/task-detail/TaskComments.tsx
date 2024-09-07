import { List, Form, ConfigProvider } from "antd";
import { Comment as AntdComment } from "@ant-design/compatible";
import React from "react";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { useMe } from "@app/hooks/useMe";
import { useUser } from "@app/hooks/useUser";
import {
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useListTaskCommentsQuery,
  useUpdateTaskCommentMutation,
} from "@app/services/api";
import { TaskCommentType, TaskType } from "@app/types/Project";
import { Confirm } from "@app/components/shared/Confirm";
import { AppEditor } from "@app/components/shared/editor/AppEditor";
import { EditorToRenderer } from "@app/components/shared/editor/EditorToRenderer";
import { HttpResult } from "@app/components/shared/HttpResult";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { Button } from "@app/components/shared/primitives/Button";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";
import { Text } from "@app/components/shared/primitives/Text";
import { XIcon, PencilIcon, TrashIcon } from "lucide-react";

type Props = {
  task: TaskType;
};

const Comment: React.FC<{
  task: TaskType;
  comment: TaskCommentType;
}> = ({ task, comment }) => {
  const [editing, setEditing] = React.useState(false);
  const { isAdmin } = useMe();
  const { user, isMe } = useUser(comment.UserId);
  const fullName = user ? user.FullName : "";
  const formattedDateTime = useFormattedDateTime(comment.DateCreated);

  const editAction = (
    <Tooltip title={editing ? "" : "Edit comment"}>
      <Button
        size="small"
        type="text"
        onClick={() => setEditing(!editing)}
        icon={editing ? <XIcon size={12} /> : <PencilIcon size={12} />}
      />
    </Tooltip>
  );

  const [deleteComment, { isLoading: isDeleting }] =
    useDeleteTaskCommentMutation();

  const onDeleteClick = async () => {
    await deleteComment({
      CommentId: comment.Id,
      TaskId: task.Id,
    });
  };
  const deleteAction = (
    <Confirm.Embed
      title="Are you sure to delete this comment?"
      onConfirm={onDeleteClick}
    >
      {isDeleting ? (
        <LoadingSpin />
      ) : (
        <Tooltip title="Delete comment">
          <Button size="small" type="text" icon={<TrashIcon size={12} />} />
        </Tooltip>
      )}
    </Confirm.Embed>
  );
  const actions = isAdmin || isMe ? [editAction, deleteAction] : undefined;

  const onEditDone = () => {
    setEditing(false);
  };

  return (
    <AntdComment
      style={{
        padding: 0,
        margin: 0,
      }}
      content={
        editing ? (
          <Editor
            task={task}
            mode="update"
            comment={comment}
            onEditDone={onEditDone}
          />
        ) : (
          <EditorToRenderer value={comment.Content} />
        )
      }
      author={<Text strong>{fullName}</Text>}
      avatar={<UserAvatar userId={comment.UserId} />}
      datetime={
        <Tooltip title={formattedDateTime}>{formattedDateTime}</Tooltip>
      }
      actions={actions}
    />
  );
};

const CommentList: React.FC<{
  task: TaskType;
  comments: TaskCommentType[];
}> = ({ task, comments }) => (
  <ConfigProvider renderEmpty={() => <>No comments found, add a comment</>}>
    <List
      dataSource={comments}
      itemLayout="horizontal"
      renderItem={(comment) => (
        <Comment key={comment.Id} task={task} comment={comment} />
      )}
      style={{ padding: 0 }}
    />
  </ConfigProvider>
);

type FormValuesType = {
  content: string;
};

const Editor: React.FC<{
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

export const TaskComments: React.FC<Props> = ({ task }) => {
  const { me } = useMe();
  const { data: comments } = useListTaskCommentsQuery(task.BoardId);
  const commentsData = comments?.Data || {};
  return (
    <>
      <CommentList task={task} comments={commentsData[task.Id] || []} />
      <AntdComment
        avatar={me && <UserAvatar userId={me?.Id} />}
        content={<Editor task={task} mode="create" />}
      />
    </>
  );
};
