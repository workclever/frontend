import { TaskType } from "@app/types/Project";
import { UserSelector } from "../../shared/UserSelector";
import React from "react";
import { useUpdateTaskAssigneeUserMutation } from "@app/services/api";
import { TaskEditableDescription } from "./TaskEditableDescription";
import { TaskRelations } from "./task-relations/TaskRelations";
import { TaskSubtasks } from "./task-subtasks/TaskSubtasks";
import { TaskCustomFieldsRenderer } from "./custom-fields/TaskCustomFieldsRenderer";
import { TaskAttachments } from "./TaskAttachments";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { TaskTimeline } from "./timeline/TaskTimeline";
import { TaskBoardColumn } from "./TaskBoardColumn";

type Props = {
  task: TaskType;
  onTaskDelete: (task: TaskType) => void;
  findSubtasks: (id: number) => TaskType[];
};

const Reporter: React.FC<Pick<Props, "task">> = ({ task }) => {
  return (
    <UserSelector
      title="Reporter"
      disabled={true}
      selectedUserIds={[task.ReporterUserId]}
      selectedProjectId={task.ProjectId}
      loading={false}
      onChange={() => {
        /* */
      }}
    />
  );
};

const Assignee: React.FC<Pick<Props, "task">> = ({ task }) => {
  const [updateAssignee, { isLoading: isAssigneeUpdating }] =
    useUpdateTaskAssigneeUserMutation();

  return (
    <UserSelector
      title="Assignee"
      selectedUserIds={task.AssigneeUserIds}
      selectedProjectId={task.ProjectId}
      loading={isAssigneeUpdating}
      onChange={async (userIds) =>
        updateAssignee({
          Task: task,
          UserIds: userIds,
        })
      }
      mode="multiple"
    />
  );
};

export const TaskDetail: React.FC<Props> = ({ task, findSubtasks }) => {
  const { goToTask } = useAppNavigate();

  const onTaskSelect = (task: TaskType) => {
    goToTask(task);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Space
          direction="vertical"
          style={{
            width: "100%",
            borderRight: "1px solid #eaeaea",
          }}
        >
          <div style={{ padding: 16 }}>
            <TaskEditableDescription task={task} />
            <div style={{ marginTop: 8 }}>
              <Divider />
              <TaskRelations task={task} onTaskSelect={onTaskSelect} />
              <TaskSubtasks
                task={task}
                onTaskSelect={onTaskSelect}
                findSubtasks={findSubtasks}
              />
              <TaskAttachments task={task} />
              <Divider />
              <TaskTimeline task={task} />
            </div>
          </div>
        </Space>
        <div style={{ width: 400 }}>
          <div style={{ padding: 16, paddingBottom: 0 }}>
            <Space style={{ width: "100%" }} direction="vertical">
              <Reporter task={task} />
              <Assignee task={task} />
            </Space>
          </div>
          <Divider style={{ marginBottom: 8 }} />
          <div style={{ padding: 16 }}>
            <TaskBoardColumn task={task} />
            <TaskCustomFieldsRenderer task={task} />
          </div>
        </div>
      </div>
    </>
  );
};
