import React from "react";
import {
  useCreateTaskRelationMutation,
  useUpdateTaskRelationMutation,
} from "@app/services/api";
import { TaskType, TaskRelationType } from "@app/types/Project";
import { HttpResult } from "@app/components/shared/HttpResult";
import { RelationTypeSelector } from "../RelationTypeSelector";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { Modal } from "@app/components/shared/primitives/Modal";
import { TaskSearchInput } from "../../../shared/TaskSearchInput";

export const NewRelationModal: React.FC<{
  task: TaskType;
  onCancel: () => void;
  onUpdate: () => void;
  taskRelation?: TaskRelationType;
  mode: "create" | "update";
}> = ({ task, onCancel, onUpdate, taskRelation, mode }) => {
  const [targetTask, setTargetTask] = React.useState<TaskType | undefined>({
    Id: taskRelation?.TaskId,
  } as TaskType);
  const [relationTypeDefId, setRelationTypeDefId] = React.useState<
    number | undefined
  >(taskRelation?.RelationTypeDefId);
  const [
    create,
    { isLoading: isCreating, error: createError, data: createResult },
  ] = useCreateTaskRelationMutation();
  const [
    update,
    { isLoading: isUpdating, error: updateError, data: updateResult },
  ] = useUpdateTaskRelationMutation();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;
  const result = createResult || updateResult;

  const onTaskFound = (foundTask: TaskType) => {
    setTargetTask(foundTask);
  };
  const onRelationTypeSelect = (relationTypeDefId: number) => {
    setRelationTypeDefId(relationTypeDefId);
  };

  const onButtonClick = async () => {
    if (!relationTypeDefId || !targetTask) {
      return;
    }
    if (mode === "create") {
      if (!targetTask.Id) {
        return;
      }
      await create({
        BaseTaskId: task.Id,
        TargetTaskId: targetTask.Id,
        RelationTypeDefId: relationTypeDefId,
      });
    } else {
      await update({
        TaskParentRelationId: Number(taskRelation?.TaskParentRelationId),
        RelationTypeDefId: relationTypeDefId,
      });
    }
    onUpdate();
  };

  const title =
    mode === "create" ? "Create Task Relation" : "Update Task Relation";

  const button = mode === "create" ? "Create Relation" : "Update Relation";

  return (
    <Modal title={title} visible={true} onCancel={onCancel} width={600}>
      <div style={{ padding: 16 }}>
        <Space direction="vertical">
          <Space>
            <span style={{ width: 80, display: "inline-block" }}>
              This task
            </span>
            <RelationTypeSelector
              value={relationTypeDefId}
              onSelect={onRelationTypeSelect}
              direction={taskRelation?.RelationTypeDirection}
            />
          </Space>
          <Space>
            <span style={{ width: 80, display: "inline-block" }}>Task</span>
            <TaskSearchInput
              value={targetTask?.Id}
              onFind={onTaskFound}
              disabled={mode === "update"}
            />
          </Space>
          <div>
            <Space>
              <Button
                onClick={onButtonClick}
                disabled={!targetTask || !relationTypeDefId || isLoading}
                loading={isLoading}
              >
                {button}
              </Button>
            </Space>
          </div>
          <HttpResult error={error} result={result} />
        </Space>
      </div>
    </Modal>
  );
};
