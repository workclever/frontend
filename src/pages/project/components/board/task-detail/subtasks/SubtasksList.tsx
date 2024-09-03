import { ConfigProvider, List, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  useCreateSubtaskRelationMutation,
  useCreateTaskMutation,
} from "@app/services/api";
import {
  selectSelectedBoardId,
  selectSelectedProjectId,
} from "@app/slices/project/projectSlice";
import { TaskType } from "@app/types/Project";
import { HttpResult } from "@app/components/shared/HttpResult";
import { TaskDetailBlock } from "../TaskDetailBlock";
import { isSubtask } from "../utils";
import { SubtaskItem } from "./SubtaskItem";
import { Button } from "@app/components/shared/primitives/Button";
import { Tabs, TabPane } from "@app/components/shared/primitives/Tabs";
import { Space } from "@app/components/shared/primitives/Space";
import { Modal } from "@app/components/shared/primitives/Modal";
import { TaskSearchInput } from "../../../shared/TaskSearchInput";

type ManuTaskFormValuesType = {
  Title: string;
};

export const SubtasksList: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
  findSubtasks: (id: number) => TaskType[];
}> = ({ task, onTaskSelect, findSubtasks }) => {
  const [showAddSubtask, setShowAddSubtask] = React.useState(false);
  const [searchFoundTask, setSearchFoundTask] = React.useState<TaskType>();

  const onTaskSearchFound = (foundTask: TaskType) => {
    setSearchFoundTask(foundTask);
  };

  const [createTask, { error: createTaskError, data: createTaskResult }] =
    useCreateTaskMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const [form] = Form.useForm();

  const onFinishManualTask = async (values: ManuTaskFormValuesType) => {
    await createTask({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      ColumnId: task.ColumnId,
      Title: values.Title,
      ParentTaskItemId: task.Id,
      Description: "",
    });
    form.resetFields();
  };

  const [
    createSubtaskRelation,
    { error: createSubtaskRelationError, data: createSubtaskRelationResult },
  ] = useCreateSubtaskRelationMutation();

  // No need to show substasks, if selected task is already a subtask
  if (isSubtask(task)) {
    return null;
  }

  const subtasks = findSubtasks(task.Id);

  return (
    <>
      <TaskDetailBlock
        key={subtasks.length}
        title="Subtasks"
        showPlusIcon
        onClickPlusIcon={() => setShowAddSubtask(true)}
        defaultExpanded={subtasks.length > 0}
      >
        <ConfigProvider
          renderEmpty={() => <>There is no subtasks found for this task</>}
        >
          <List
            itemLayout="horizontal"
            dataSource={subtasks}
            split={false}
            renderItem={(task) => (
              <SubtaskItem
                key={(task as TaskType).Id}
                task={task}
                onTaskSelect={onTaskSelect}
              />
            )}
          />
        </ConfigProvider>
      </TaskDetailBlock>
      {showAddSubtask && (
        <Modal
          title={"Add a subtask"}
          visible={true}
          onCancel={() => setShowAddSubtask(false)}
          width={600}
        >
          <div style={{ padding: 16 }}>
            <Tabs defaultActiveKey="1" size="small">
              <TabPane tab="Search task" key="1">
                <Space direction="vertical">
                  <TaskSearchInput
                    value={searchFoundTask?.Id}
                    onFind={onTaskSearchFound}
                  />
                  <Button
                    disabled={!searchFoundTask}
                    type="primary"
                    onClick={() => {
                      createSubtaskRelation({
                        ParentTaskItemId: task.Id,
                        TaskId: Number(searchFoundTask?.Id),
                      });
                    }}
                  >
                    Create subtask relation
                  </Button>
                  <HttpResult
                    error={createSubtaskRelationError}
                    result={createSubtaskRelationResult}
                  />
                </Space>
              </TabPane>
              <TabPane tab="Manual task creation" key="2">
                <Form<ManuTaskFormValuesType>
                  name="basic"
                  initialValues={{
                    Title: "",
                  }}
                  onFinish={onFinishManualTask}
                  autoComplete="off"
                  form={form}
                >
                  <Form.Item
                    name="Title"
                    rules={[
                      { required: true, message: "Please enter task title" },
                    ]}
                  >
                    <Input placeholder="Create a new sub task" />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      Create subtask
                    </Button>
                  </Form.Item>
                </Form>
                <HttpResult error={createTaskError} result={createTaskResult} />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      )}
    </>
  );
};
