import { ConfigProvider, List } from "antd";
import React from "react";
import { useListTaskRelationsQuery } from "../../../../../../services/api";
import { TaskType } from "../../../../../../types/Project";
import { TaskDetailBlock } from "../TaskDetailBlock";
import { RelationItem } from "./RelationItem";
import { NewRelationModal } from "./NewRelationModal";

export const TaskRelations: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
}> = ({ task, onTaskSelect }) => {
  const { data, refetch } = useListTaskRelationsQuery(task.Id);
  const relations = data?.Data || [];
  const [showRelationSearchModal, setShowRelationSearchModal] =
    React.useState(false);

  return (
    <>
      <TaskDetailBlock
        key={relations.length}
        title="Relations"
        showPlusIcon
        onClickPlusIcon={() => setShowRelationSearchModal(true)}
        defaultExpanded={relations.length > 0}
      >
        <ConfigProvider
          renderEmpty={() => <>There is no related tasks found for this task</>}
        >
          <List
            itemLayout="horizontal"
            dataSource={relations}
            split={false}
            renderItem={(taskRelation) => (
              <RelationItem
                key={taskRelation.Id}
                baseTask={task}
                taskRelation={taskRelation}
                onUpdate={refetch}
                onTaskSelect={onTaskSelect}
              />
            )}
          />
        </ConfigProvider>
      </TaskDetailBlock>
      {showRelationSearchModal && (
        <NewRelationModal
          task={task}
          onExit={() => setShowRelationSearchModal(false)}
          onUpdate={refetch}
          mode="create"
        />
      )}
    </>
  );
};
