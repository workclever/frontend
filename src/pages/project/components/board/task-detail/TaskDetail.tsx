import { Col, Row } from "antd";
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
import { useSelector } from "react-redux";
import { selectBoardViewType } from "../../../../../slices/project/projectSlice";
import {
  Tabs,
  TabPane,
} from "../../../../../components/shared/primitives/Tabs";
import { Space } from "../../../../../components/shared/primitives/Space";
import { Divider } from "../../../../../components/shared/primitives/Divider";
import { blue } from "@ant-design/colors";

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

const TaskDetailKanbanLayout: React.FC<Props> = ({
  task,
  onTaskSelect,
  findSubtasks,
  onTaskDelete,
}) => {
  return (
    <Row gutter={4} wrap={false}>
      <Col flex="auto" style={{ padding: 8 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <TaskEditableDescription task={task} />
          <TaskRelations task={task} onTaskSelect={onTaskSelect} />
          <SubtasksList
            task={task}
            onTaskSelect={onTaskSelect}
            findSubtasks={findSubtasks}
          />
          <TaskAttachments task={task} />
        </Space>
        <TaskTabs task={task} />
      </Col>
      <Col
        flex="340px"
        style={{
          padding: 8,
          borderLeft: `1px solid ${blue[1]}`,
        }}
      >
        <Reporter task={task} />
        <Assignee task={task} />
        <div style={{ margin: "8px 0" }} />
        <TaskCustomFieldsRenderer task={task} />
        <div style={{ margin: "8px 0" }} />
        <Space>
          <TaskMover task={task} />
          <TaskDelete task={task} onTaskDelete={onTaskDelete} />
        </Space>
      </Col>
    </Row>
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
