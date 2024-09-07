import React from "react";
import { TaskType } from "@app/types/Project";
import { TaskDetailBlock } from "../TaskDetailBlock";
import { SubtaskItem } from "./SubtaskItem";
import { Empty } from "@app/components/shared/primitives/Empty";
import { NewSubtaskModal } from "./NewSubtaskModal";

export const TaskSubtasks: React.FC<{
  task: TaskType;
  onTaskSelect: (task: TaskType) => void;
  findSubtasks: (id: number) => TaskType[];
}> = ({ task, onTaskSelect, findSubtasks }) => {
  const [showAddSubtask, setShowAddSubtask] = React.useState(false);
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
        {subtasks.length === 0 ? (
          <Empty textAlign="left">
            There is no subtasks found for this task
          </Empty>
        ) : (
          subtasks.map((task) => {
            return (
              <SubtaskItem
                key={(task as TaskType).Id}
                task={task}
                onTaskSelect={onTaskSelect}
              />
            );
          })
        )}
      </TaskDetailBlock>
      {showAddSubtask && (
        <NewSubtaskModal
          onCancel={() => setShowAddSubtask(false)}
          task={task}
        />
      )}
    </>
  );
};
