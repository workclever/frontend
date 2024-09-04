/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@app/services/api";
import { BaseOutput } from "@app/types/BaseOutput";
import { TaskType } from "@app/types/Project";
import { UpdateTaskPropertyParams } from "@app/types/Task";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

// TODO fix ts-ignore
export const taskUpdateLocalState = (
  task: TaskType,
  params: UpdateTaskPropertyParams | UpdateTaskPropertyParams[],
  dispatch: ThunkDispatch<any, any, AnyAction>
) => {
  const patchResult1 = dispatch(
    api.util.updateQueryData(
      "listProjectTasks",
      task.ProjectId,
      (tasks: BaseOutput<TaskType[]>) => {
        const taskToUpdate = tasks.Data.find((r) => r.Id === task.Id);
        if (taskToUpdate) {
          if (Array.isArray(params)) {
            for (const p of params) {
              // @ts-ignore
              taskToUpdate[p.property] = p.value;
            }
          } else {
            // @ts-ignore
            taskToUpdate[params.property] = params.value;
          }
        }
      }
    )
  );

  const patchResult2 = dispatch(
    api.util.updateQueryData(
      "getTask",
      task.Id,
      (draft: BaseOutput<TaskType>) => {
        const taskToUpdate = draft?.Data;
        if (!taskToUpdate) {
          return;
        }
        // @ts-ignore
        if (Array.isArray(params)) {
          for (const p of params) {
            // @ts-ignore
            taskToUpdate[p.property] = p.value;
          }
        } else {
          // @ts-ignore
          taskToUpdate[params.property] = params.value;
        }
      }
    )
  );

  return {
    patchResult1,
    patchResult2,
  };
};
