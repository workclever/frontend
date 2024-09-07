import { Form, Input } from "antd";
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
import { Button } from "@app/components/shared/primitives/Button";
import { Tabs, TabPane } from "@app/components/shared/primitives/Tabs";
import { Space } from "@app/components/shared/primitives/Space";
import { Modal } from "@app/components/shared/primitives/Modal";
import { TaskSearchInput } from "../../../shared/TaskSearchInput";

type NewSubtaskModalFormValuesType = {
  Title: string;
};

export const NewSubtaskModal: React.FC<{
  onCancel: () => void;
  task: TaskType;
}> = ({ onCancel, task }) => {
  const [searchFoundTask, setSearchFoundTask] = React.useState<TaskType>();

  const onTaskSearchFound = (foundTask: TaskType) => {
    setSearchFoundTask(foundTask);
  };

  const [createTask, { error: createTaskError, data: createTaskResult }] =
    useCreateTaskMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const [form] = Form.useForm();

  const onFinishManualTask = async (values: NewSubtaskModalFormValuesType) => {
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

  return (
    <Modal title={"Add a subtask"} visible onCancel={onCancel} width={600}>
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
            <Form<NewSubtaskModalFormValuesType>
              initialValues={{
                Title: "",
              }}
              onFinish={onFinishManualTask}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                name="Title"
                rules={[{ required: true, message: "Please enter task title" }]}
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
  );
};
