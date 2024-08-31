import { Form } from "antd";
import React from "react";
import { useFormattedDateTime } from "../../../../../hooks/useFormattedDateTime";
import { useMe } from "../../../../../hooks/useMe";
import { useUser } from "../../../../../hooks/useUser";
import {
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useListTaskCommentsQuery,
  useUpdateTaskCommentMutation,
} from "../../../../../services/api";
import { TaskCommentType, TaskType } from "../../../../../types/Project";
import { Confirm } from "../../../../../components/shared/Confirm";
import { AppEditor } from "../../../../../components/shared/editor/AppEditor";
import { EditorToRenderer } from "../../../../../components/shared/editor/EditorToRenderer";
import { HttpResult } from "../../../../../components/shared/HttpResult";
import { UserAvatar } from "../../../../../components/shared/UserAvatar";
import { Button } from "../../../../../components/shared/primitives/Button";
import { Tooltip } from "../../../../../components/shared/primitives/Tooltip";
import { LoadingSpin } from "../../../../../components/shared/primitives/LoadingSpin";
import { Text } from "../../../../../components/shared/primitives/Text";
import { List } from "../../../../../components/shared/primitives/List";
import AtlasKitComment, { CommentTime, CommentAction } from "@atlaskit/comment";
import { Stack, xcss } from "@atlaskit/primitives";

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
    <CommentAction onClick={() => setEditing(!editing)}>Edit</CommentAction>
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
      <CommentAction>
        {isDeleting ? (
          <LoadingSpin />
        ) : (
          <Tooltip title="Delete comment">Delete</Tooltip>
        )}
      </CommentAction>
    </Confirm.Embed>
  );
  const actions = isAdmin || isMe ? [editAction, deleteAction] : undefined;

  const onEditDone = () => {
    setEditing(false);
  };

  return (
    <AtlasKitComment
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
      time={<CommentTime>{formattedDateTime}</CommentTime>}
      actions={actions}
    />
  );
};

const CommentList: React.FC<{
  task: TaskType;
  comments: TaskCommentType[];
}> = ({ task, comments }) => {
  if (comments.length === 0) {
    return <>No comments found, add a comment</>;
  }
  return (
    <List
      dataSource={comments}
      renderItem={(comment) => (
        <Comment key={comment.Id} task={task} comment={comment} />
      )}
    />
  );
};

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
      onEditDone && onEditDone();
    }
    setInitialValues({ content: "" });
    form.resetFields();
  };

  return (
    <>
      <Form<FormValuesType>
        name="basic"
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
            type="submit"
            appearance="primary"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {mode === "create" ? "Comment" : "Update"}
          </Button>
        </Form.Item>
        <HttpResult
          error={createError || updateError}
          style={{ marginTop: 4 }}
        />
      </Form>
    </>
  );
};

export const TaskComments: React.FC<Props> = ({ task }) => {
  const { data: comments } = useListTaskCommentsQuery(task.BoardId);
  const commentsData = comments?.Data || {};
  return (
    <Stack
      space="space.100"
      xcss={xcss({
        marginTop: "space.100",
        width: "100%",
      })}
    >
      <CommentList task={task} comments={commentsData[task.Id] || []} />
      <AtlasKitComment
        avatar={<UserAvatar userId={0} />}
        content={<Editor task={task} mode="create" />}
      />
    </Stack>
  );
};
