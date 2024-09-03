import { TaskType } from "@app/types/Project";
import React from "react";
import { useTaskUpdateProperty } from "@app/hooks/useTaskUpdateProperty";
import { HttpResult } from "@app/components/shared/HttpResult";
import { AppEditor } from "@app/components/shared/editor/AppEditor";
import { debounce } from "lodash";

type Props = {
  task: TaskType;
};

export const TaskEditableDescription: React.FC<Props> = ({ task }) => {
  const { updateTask, error } = useTaskUpdateProperty(task);

  const onChange = (e: string) => {
    updateTask({
      property: "Description",
      value: e,
    });
  };

  const debouncedOnChange = debounce((value: string) => {
    if (onChange) {
      onChange(value);
    }
  }, 1000);

  return (
    <div style={{ marginTop: 4, minHeight: 200 }}>
      <HttpResult error={error} />
      <AppEditor
        value={task.Description}
        onChange={debouncedOnChange}
        showToolbar={true}
        initialViewMode={"viewing"}
      />
    </div>
  );
};
