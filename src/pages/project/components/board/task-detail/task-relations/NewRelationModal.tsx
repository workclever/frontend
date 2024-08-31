import React from "react";
import {
  useCreateTaskRelationMutation,
  useUpdateTaskRelationMutation,
  useDeleteTaskRelationMutation,
} from "../../../../../../services/api";
import { TaskType, TaskRelationType } from "../../../../../../types/Project";
import { Confirm } from "../../../../../../components/shared/Confirm";
import { HttpResult } from "../../../../../../components/shared/HttpResult";
import { TaskSearchInput } from "../../../shared/TaskSearchInput";
import { RelationTypeSelector } from "../RelationTypeSelector";
import { Button } from "../../../../../../components/shared/primitives/Button";
import { Space } from "../../../../../../components/shared/primitives/Space";
import { Modal } from "../../../../../../components/shared/primitives/Modal";

export const NewRelationModal: React.FC<{
  task: TaskType;
  onExit: () => void;
  onUpdate: () => void;
  taskRelation?: TaskRelationType;
  mode: "create" | "update";
}> = ({ task, onExit, onUpdate, taskRelation, mode }) => {
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
  const [deleteRelationParent, { isLoading: isDeleting }] =
    useDeleteTaskRelationMutation();

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
    <Modal title={title} visible={true} onCancel={onExit} width={600}>
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
              selectedTaskId={targetTask?.Id}
              onFind={onTaskFound}
              disabled={mode === "update"}
            />
          </Space>
          <div>
            <Space>
              <Button
                onClick={onButtonClick}
                isDisabled={!targetTask || !relationTypeDefId || isLoading}
                isLoading={isLoading}
              >
                {button}
              </Button>
              {mode === "update" && (
                <Confirm.Embed
                  title="Are you sure to delete this relation?"
                  onConfirm={async () => {
                    await deleteRelationParent(
                      Number(taskRelation?.TaskParentRelationId)
                    );
                    onUpdate();
                  }}
                >
                  <Button isLoading={isDeleting} appearance="danger">
                    Delete relation
                  </Button>
                </Confirm.Embed>
              )}
            </Space>
          </div>
          <HttpResult error={error} result={result} />
        </Space>
      </div>
    </Modal>
  );
};
