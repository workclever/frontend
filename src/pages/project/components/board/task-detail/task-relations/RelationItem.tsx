import React from "react";
import { useTask } from "@app/hooks/useTask";
import { useTaskRelationTypeDefs } from "@app/hooks/useTaskRelationTypeDefs";
import { TaskType, TaskRelationType } from "@app/types/Project";
import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { NewRelationModal } from "./NewRelationModal";
import { Space } from "@app/components/shared/primitives/Space";
import { Tag } from "@app/components/shared/primitives/Tag";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import { Modal } from "@app/components/shared/primitives/Modal";
import { Button } from "@app/components/shared/primitives/Button";
import { useDeleteTaskRelationMutation } from "@app/services/api";
import { PencilIcon, TrashIcon } from "lucide-react";

export const RelationItem: React.FC<{
  baseTask: TaskType;
  taskRelation: TaskRelationType;
  onUpdate: () => void;
  onTaskSelect: (task: TaskType) => void;
}> = ({ baseTask, taskRelation, onUpdate, onTaskSelect }) => {
  const { task: relatedTask } = useTask(taskRelation.TaskId);
  const [editing, setEditing] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [deleteRelationParent, { isLoading: isDeleting }] =
    useDeleteTaskRelationMutation();

  const relationTypeDefs = useTaskRelationTypeDefs();
  if (!relatedTask) {
    // console.warn("relatedTask is not found while rendering relation");
    return null;
  }

  const relationTypeDef = relationTypeDefs.find(
    (r) => r.Id === taskRelation.RelationTypeDefId
  );

  const operationName = () => {
    if (taskRelation.RelationTypeDirection === "INWARD") {
      return relationTypeDef?.InwardOperationName;
    }
    if (taskRelation.RelationTypeDirection === "OUTWARD") {
      return relationTypeDef?.OutwardOperationName;
    }
    return "";
  };

  return (
    <>
      <EnhancedDropdownMenu
        triggers={["contextMenu"]}
        items={[
          {
            key: "1",
            label: "Edit relation",
            icon: <PencilIcon size={12} />,
            onClick: () => setEditing(true),
          },
          {
            key: "2",
            label: "Delete relation",
            icon: <TrashIcon size={12} />,
            onClick: () => setDeleting(true),
            danger: true,
          },
        ]}
        triggerElement={
          <HoverableListItem onClick={() => onTaskSelect(relatedTask)}>
            <div style={{ cursor: "pointer", flex: 1 }}>
              <Space>
                <Tag
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {operationName()}
                </Tag>
                <TaskIdRenderer task={relatedTask} />
                <span>{relatedTask?.Title}</span>
              </Space>
            </div>
          </HoverableListItem>
        }
      />
      {editing && (
        <NewRelationModal
          task={baseTask}
          onUpdate={onUpdate}
          onCancel={() => setEditing(false)}
          mode="update"
          taskRelation={taskRelation}
        />
      )}
      {deleting && (
        <Modal
          title={"Delete relation"}
          visible
          onCancel={() => {
            setDeleting(false);
          }}
          width={450}
        >
          <Space direction="vertical">
            <div>Are you sure to delete this relation?</div>
            <Button
              danger
              loading={isDeleting}
              onClick={async () => {
                await deleteRelationParent(
                  Number(taskRelation?.TaskParentRelationId)
                );
                onUpdate();
              }}
            >
              Delete relation
            </Button>
          </Space>
        </Modal>
      )}
    </>
  );
};
