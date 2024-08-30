import { TaskType } from "../../../../../types/Project";
import React from "react";
import { useTaskUpdateProperty } from "../../../../../hooks/useTaskUpdateProperty";
import { HttpResult } from "../../../../../components/shared/HttpResult";
import { AppEditor } from "../../../../../components/shared/editor/AppEditor";
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
    onChange && onChange(value);
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
