import { Confirm } from "@app/components/shared/Confirm";
import { EditorToRenderer } from "@app/components/shared/editor/EditorToRenderer";
import { LoadingSpin } from "@app/components/shared/primitives/LoadingSpin";
import { useFormattedDateTime } from "@app/hooks/useFormattedDateTime";
import { useMe } from "@app/hooks/useMe";
import { useUser } from "@app/hooks/useUser";
import { useDeleteTaskCommentMutation } from "@app/services/api";
import { TaskType, TaskCommentType } from "@app/types/Project";
import { XIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import { TaskCommentEditor } from "./TaskCommentEditor";
import { Comment as AntdComment } from "@ant-design/compatible";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { Button } from "@app/components/shared/primitives/Button";

export const TaskComment: React.FC<{
  task: TaskType;
  comment: TaskCommentType;
}> = ({ task, comment }) => {
  const [editing, setEditing] = React.useState(false);
  const { isAdmin } = useMe();
  const { user, isMe } = useUser(comment.UserId);
  const fullName = user ? user.FullName : "";
  const formattedDateTime = useFormattedDateTime(comment.DateCreated);

  const editAction = (
    <Button
      size="small"
      type="text"
      onClick={() => setEditing(!editing)}
      icon={editing ? <XIcon size={12} /> : <PencilIcon size={12} />}
    />
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
          <TaskCommentEditor
            task={task}
            mode="update"
            comment={comment}
            onEditDone={onEditDone}
          />
        ) : (
          <EditorToRenderer value={comment.Content} />
        )
      }
      author={<span style={{ fontWeight: "bold" }}>{fullName}</span>}
      datetime={
        <Tooltip title={formattedDateTime}>{formattedDateTime}</Tooltip>
      }
      actions={actions}
    />
  );
};
