import { TaskType } from "@app/types/Project";
import React from "react";
import { HttpResult } from "@app/components/shared/HttpResult";
import { AppEditor } from "@app/components/shared/editor/AppEditor";
import { debounce } from "lodash";
import { useUpdateTaskPropertyMutation } from "@app/services/api";

type Props = {
  task: TaskType;
};

export const TaskEditableDescription: React.FC<Props> = ({ task }) => {
  const [update, { error }] = useUpdateTaskPropertyMutation();

  const onChange = (e: string) => {
    update({
      Task: task,
      Params: [
        {
          property: "Description",
          value: e,
        },
      ],
    });
  };

  const debouncedOnChange = debounce((value: string) => {
    if (onChange) {
      onChange(value);
    }
  }, 1000);

  return (
    <div style={{ minHeight: 200 }}>
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
