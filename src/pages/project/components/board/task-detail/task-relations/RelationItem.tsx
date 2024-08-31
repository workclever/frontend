// import { EditOutlined } from "@ant-design/icons";
import React from "react";
import { useTask } from "../../../../../../hooks/useTask";
import { useTaskRelationTypeDefs } from "../../../../../../hooks/useTaskRelationTypeDefs";
import { TaskType, TaskRelationType } from "../../../../../../types/Project";
import { TaskIdRenderer } from "../../../../../../components/shared/TaskIdRenderer";
import { NewRelationModal } from "./NewRelationModal";
import { Button } from "../../../../../../components/shared/primitives/Button";
import { Space } from "../../../../../../components/shared/primitives/Space";
import { Tag } from "../../../../../../components/shared/primitives/Tag";
import { blue } from "@ant-design/colors";

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
    <>
      <div
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: 5, flex: 1 }}
          onClick={() => onTaskSelect(relatedTask)}
        >
          <Space>
            <Tag style={{ backgroundColor: blue[1] }}>{operationName()}</Tag>
            <TaskIdRenderer task={relatedTask} />
            <span>{relatedTask?.Title}</span>
          </Space>
        </div>
        <Button
          onClick={() => setEditing(true)}
          // TODOAK iconAfter={<EditOutlined style={{ fontSize: 14 }} />}
        >
          edit
        </Button>
      </div>
      {editing && (
        <NewRelationModal
          task={baseTask}
          onUpdate={onUpdate}
          onExit={() => setEditing(false)}
          mode="update"
          taskRelation={taskRelation}
        />
      )}
    </>
  );
};
