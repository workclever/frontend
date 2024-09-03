import { EditOutlined } from "@ant-design/icons";
import { List } from "antd";
import React from "react";
import { useTask } from "@app/hooks/useTask";
import { useTaskRelationTypeDefs } from "@app/hooks/useTaskRelationTypeDefs";
import { TaskType, TaskRelationType } from "@app/types/Project";
import { HoverableListItem } from "@app/components/shared/HoverableListItem";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { NewRelationModal } from "./NewRelationModal";
import { Button } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { Tag } from "@app/components/shared/primitives/Tag";

export const RelationItem: React.FC<{
  baseTask: TaskType;
  taskRelation: TaskRelationType;
  onUpdate: () => void;
  onTaskSelect: (task: TaskType) => void;
}> = ({ baseTask, taskRelation, onUpdate, onTaskSelect }) => {
  const relatedTask = useTask(taskRelation.TaskId);
  const [editing, setEditing] = React.useState(false);

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
    <HoverableListItem>
      <List.Item
        style={{ padding: 0 }}
        extra={
          <Button
            onClick={() => setEditing(true)}
            icon={<EditOutlined style={{ fontSize: 14 }} />}
            size="small"
          />
        }
      >
        <List.Item.Meta
          title={
            <div
              style={{ display: "flex", alignItems: "center", padding: 5 }}
              onClick={() => onTaskSelect(relatedTask)}
            >
              <Space>
                <Tag>{operationName()}</Tag>
                <TaskIdRenderer task={relatedTask} />
                <span>{relatedTask?.Title}</span>
              </Space>
            </div>
          }
        />
      </List.Item>
      {editing && (
        <NewRelationModal
          task={baseTask}
          onUpdate={onUpdate}
          onExit={() => setEditing(false)}
          mode="update"
          taskRelation={taskRelation}
        />
      )}
    </HoverableListItem>
  );
};
