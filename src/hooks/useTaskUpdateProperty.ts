import { api, useUpdateTaskPropertyMutation } from "../services/api";
import { selectSelectedProjectId } from "../slices/project/projectSlice";
import { TaskType } from "../types/Project";
import { useDispatch, useSelector } from "react-redux";
import { optimisticUpdateDependOnApi } from "./optimisticUpdateDependOnApi";
import { AnyAction } from "@reduxjs/toolkit";
import { useProjectTasks } from "./useProjectTasks";
import { BaseOutput } from "../types/BaseOutput";

type UpdateTaskPropertyParams<T extends keyof TaskType = keyof TaskType> = {
  property: T;
  value: TaskType[T];
};

export const useTaskUpdateProperty = (task: TaskType) => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [update, { error }] = useUpdateTaskPropertyMutation();
  const tasks = useProjectTasks();

  const updateStateOnly = (params: UpdateTaskPropertyParams): AnyAction[] => {
    // First update all tasks, this updates task when user viewing board
    const tempTask = task;
    const action = api.util.updateQueryData(
      "listProjectTasks",
      Number(selectedProjectId),
      (draft: BaseOutput<TaskType[]>) => {
        const taskToUpdate = (draft?.Data || []).find(
          (r) => r.Id === tempTask.Id
        ) as TaskType;
        if (!taskToUpdate) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        taskToUpdate[params.property] = params.value;
        console.log("updateStateOnly", params);
      }
    );

    // Second update the singular task, this updates task when user viewing /task/:taskId page
    const action2 = api.util.updateQueryData("getTask", task.Id, (draft) => {
      const taskToUpdate = draft?.Data;
      if (!taskToUpdate) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      taskToUpdate[params.property] = params.value;
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [dispatch(action), dispatch(action2)];
  };

  return {
    updateTask: async (params: UpdateTaskPropertyParams) => {
      const internalTask = tasks[task.Id];
      if (!internalTask) {
        return;
      }

       
      if (internalTask[params.property] == params.value) {
        console.log("no need to go to api for task");
        return;
      }

      optimisticUpdateDependOnApi(
        () =>
          update({
            TaskId: task.Id,
            Property: params.property,
            Value: String(params.value),
          }),
        () => updateStateOnly(params)
      );
    },
    updateStateOnly,
    error,
  };
};
