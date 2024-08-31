import { TaskType } from "../../../../../types/Project";
import { UserSelector } from "../../shared/UserSelector";
import { TaskMover } from "../../shared/TaskMover";
import React from "react";
import { useTaskUpdateProperty } from "../../../../../hooks/useTaskUpdateProperty";
import { useUpdateTaskAssigneeUserMutation } from "../../../../../services/api";
import { TaskEditableDescription } from "./TaskEditableDescription";
import { optimisticUpdateDependOnApi } from "../../../../../hooks/optimisticUpdateDependOnApi";
import { TaskComments } from "./TaskComments";
import { TaskChangeLog } from "./TaskChangeLog";
import { TaskRelations } from "./task-relations/TaskRelations";
import { SubtasksList } from "./subtasks/SubtasksList";
import { TaskCustomFieldsRenderer } from "./custom-fields/TaskCustomFieldsRenderer";
import { TaskDelete } from "./TaskDelete";
import { TaskAttachments } from "./TaskAttachments";
import { TaskEditableTitle } from "./TaskEditableTitle";
import { Space } from "../../../../../components/shared/primitives/Space";
import { Divider } from "../../../../../components/shared/primitives/Divider";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";

type Props = {
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
  onTaskDelete: (task: TaskType) => void;
  findSubtasks: (id: number) => TaskType[];
};

const Reporter: React.FC<Pick<Props, "task">> = ({ task }) => {
  return (
    <UserSelector
      title="Reporter"
      disabled={true}
      selectedUserId={task.ReporterUserId}
      loading={false}
      onChange={() => {
        /* */
      }}
      unSelectedText="Unassigned"
    />
  );
};

const Assignee: React.FC<Pick<Props, "task">> = ({ task }) => {
  const { updateStateOnly } = useTaskUpdateProperty(task);
  const [updateAssignee, { isLoading: isAssigneeUpdating }] =
    useUpdateTaskAssigneeUserMutation();
  return (
    <>
      <UserSelector
        title="Assignee"
        selectedUserId={task.AssigneeUserId}
        loading={isAssigneeUpdating}
        onChange={async (userId) =>
          optimisticUpdateDependOnApi(
            () =>
              updateAssignee({
                TaskId: task.Id,
                UserId: userId,
              }),
            () =>
              updateStateOnly({
                property: "AssigneeUserId",
                value: userId,
              })
          )
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
    <Tabs id="default">
      <TabList>
        <Tab>Comments</Tab>
        <Tab>Change log</Tab>
      </TabList>
      <TabPanel>
        <TaskComments task={task} />
      </TabPanel>
      <TabPanel>
        <TaskChangeLog task={task} />
      </TabPanel>
    </Tabs>
  );
};

export const TaskDetail: React.FC<Props> = ({
  task,
  findSubtasks,
  onTaskDelete,
  onTaskSelect,
}) => {
  const Pad: React.FC<{ children: React.ReactNode }> = (props) => (
    <div style={{ padding: 4 }}>{props.children}</div>
  );

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Pad>
          <TaskEditableTitle task={task} onTaskSelect={onTaskSelect} />
        </Pad>
        <Divider style={{ margin: 0, padding: 0 }} />
        <Pad>
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
        <Pad>
          <TaskEditableDescription task={task} />
          <Divider style={{ margin: "8px 0" }} />
          <TaskRelations task={task} onTaskSelect={onTaskSelect} />
          <SubtasksList
            task={task}
            onTaskSelect={onTaskSelect}
            findSubtasks={findSubtasks}
          />
          <TaskAttachments task={task} />
          <div style={{ margin: "8px 0" }} />
          <TaskCustomFieldsRenderer task={task} />
          <TaskTabs task={task} />
        </Pad>
      </Space>
    </>
  );
};
