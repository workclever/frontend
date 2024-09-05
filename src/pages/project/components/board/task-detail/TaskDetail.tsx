import { TaskType } from "@app/types/Project";
import { UserSelector } from "../../shared/UserSelector";
import { TaskMover } from "../../shared/TaskMover";
import React from "react";
import { useUpdateTaskAssigneeUserMutation } from "@app/services/api";
import { TaskEditableDescription } from "./TaskEditableDescription";
import { TaskComments } from "./TaskComments";
import { TaskChangeLog } from "./TaskChangeLog";
import { TaskRelations } from "./task-relations/TaskRelations";
import { TaskSubtasks } from "./task-subtasks/TaskSubtasks";
import { TaskCustomFieldsRenderer } from "./custom-fields/TaskCustomFieldsRenderer";
import { TaskDelete } from "./TaskDelete";
import { TaskAttachments } from "./TaskAttachments";
import { TaskEditableTitle } from "./TaskEditableTitle";
import { Tabs, TabPane } from "@app/components/shared/primitives/Tabs";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";
import { useAppNavigate } from "@app/hooks/useAppNavigate";

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
      selectedUserId={task.ReporterUserId}
      selectedProjectId={task.ProjectId}
      loading={false}
      onChange={() => {
        /* */
      }}
      unSelectedText="Unassigned"
    />
  );
};

const Assignee: React.FC<Pick<Props, "task">> = ({ task }) => {
  const [updateAssignee, { isLoading: isAssigneeUpdating }] =
    useUpdateTaskAssigneeUserMutation();

  return (
    <>
      <UserSelector
        title="Assignee"
        selectedUserId={task.AssigneeUserId}
        selectedProjectId={task.ProjectId}
        loading={isAssigneeUpdating}
        onChange={async (userId) =>
          updateAssignee({
            Task: task,
            UserId: userId,
          })
        }
        unSelectedText="Unassigned"
      />
      {/* <HttpResult
        error={updateAssigneeError}
        result={updateAssigneeResult}
        style={{ marginTop: 4 }}
      /> */}
    </>
  );
};

const TaskTabs: React.FC<Pick<Props, "task">> = ({ task }) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Comments" key="1">
        <TaskComments task={task} />
      </TabPane>
      <TabPane tab="Change log" key="2">
        <TaskChangeLog task={task} />
      </TabPane>
    </Tabs>
  );
};

export const TaskDetail: React.FC<Props> = ({
  task,
  findSubtasks,
  onTaskDelete,
}) => {
  const { goToTask } = useAppNavigate();

  const Pad: React.FC<{
    children: React.ReactNode;
    style?: React.CSSProperties;
  }> = (props) => (
    <div style={{ padding: 4, ...props.style }}>{props.children}</div>
  );

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
          <Pad style={{ paddingLeft: 16, paddingTop: 16 }}>
            <TaskEditableTitle task={task} onTaskSelect={onTaskSelect} />
          </Pad>
          <Pad style={{ paddingLeft: 16, paddingTop: 0 }}>
            <Space style={{ width: "100%" }}>
              <Reporter task={task} />
              <Assignee task={task} />
            </Space>
            <Space style={{ marginTop: 8 }}>
              <TaskMover task={task} />
              <TaskDelete task={task} onTaskDelete={onTaskDelete} />
            </Space>
          </Pad>
          <Divider style={{ margin: 0, padding: 0 }} />
          <div style={{ padding: 16 }}>
            <TaskEditableDescription task={task} />
            <div style={{ marginTop: 8 }}>
              <TaskRelations task={task} onTaskSelect={onTaskSelect} />
              <TaskSubtasks
                task={task}
                onTaskSelect={onTaskSelect}
                findSubtasks={findSubtasks}
              />
              <TaskAttachments task={task} />
              <TaskTabs task={task} />
            </div>
          </div>
        </Space>
        <div style={{ width: 400, padding: 16 }}>
          <TaskCustomFieldsRenderer task={task} />
        </div>
      </div>
    </>
  );
};
