import { ConfigProvider, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  useCreateSubtaskRelationMutation,
  useCreateTaskMutation,
} from "../../../../../../services/api";
import {
  selectSelectedBoardId,
  selectSelectedProjectId,
} from "../../../../../../slices/project/projectSlice";
import { TaskType } from "../../../../../../types/Project";
import { HttpResult } from "../../../../../../components/shared/HttpResult";
import { TaskSearchInput } from "../../../shared/TaskSearchInput";
import { TaskDetailBlock } from "../TaskDetailBlock";
import { isSubtask } from "../utils";
import { SubtaskItem } from "./SubtaskItem";
import { Button } from "../../../../../../components/shared/primitives/Button";
import { Modal } from "../../../../../../components/shared/primitives/Modal";
import { List } from "../../../../../../components/shared/primitives/List";
import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
import { Stack, xcss } from "@atlaskit/primitives";

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
            dataSource={subtasks}
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
            <Tabs id="default">
              <TabList>
                <Tab>Search task</Tab>
                <Tab>Manual task creation</Tab>
              </TabList>
              <TabPanel>
                <Stack
                  space="space.100"
                  xcss={xcss({
                    marginTop: "space.100",
                  })}
                >
                  <TaskSearchInput
                    selectedTaskId={searchFoundTask?.Id}
                    onFind={onTaskSearchFound}
                  />
                  <Button
                    isDisabled={!searchFoundTask}
                    appearance="primary"
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
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack
                  space="space.100"
                  xcss={xcss({
                    marginTop: "space.100",
                  })}
                >
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
                      <Button type="submit" appearance="primary">
                        Create subtask
                      </Button>
                    </Form.Item>
                  </Form>
                  <HttpResult
                    error={createTaskError}
                    result={createTaskResult}
                  />
                </Stack>
              </TabPanel>
            </Tabs>
          </div>
        </Modal>
      )}
    </>
  );
};
