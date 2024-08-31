import React from "react";
import { useListTaskRelationsQuery } from "../../../../../../services/api";
import { TaskType } from "../../../../../../types/Project";
import { TaskDetailBlock } from "../TaskDetailBlock";
import { RelationItem } from "./RelationItem";
import { NewRelationModal } from "./NewRelationModal";
import { List } from "../../../../../../components/shared/primitives/List";

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
        {relations.length === 0 ? (
          <>There is no related tasks found for this task</>
        ) : (
          <List
            dataSource={relations}
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
        )}
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
