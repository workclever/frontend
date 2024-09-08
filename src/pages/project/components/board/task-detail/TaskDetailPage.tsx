import { useParams } from "react-router-dom";
import { TaskDetail } from "./TaskDetail";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useBoardData } from "../hooks/useBoardData";
import {
  loadTaskDetailStarted,
  setSelectedTaskId,
} from "@app/slices/taskDetail/taskDetailSlice";
import { useTask } from "@app/hooks/useTask";

export const TaskDetailPage = () => {
  const dispatch = useDispatch();
  const { taskId: taskIdString } = useParams();
  const taskId = Number(taskIdString?.split("-")[1]);
  const { task } = useTask(taskId);
  const { findSubtasks } = useBoardData(Number(task?.ProjectId));

  useEffect(() => {
    if (task) {
      dispatch(loadTaskDetailStarted({ task }));
    }

    return () => {
      dispatch(setSelectedTaskId(0));
    };
  }, [dispatch, task]);

  if (!task) {
    return null;
  }

  return <TaskDetail task={task} findSubtasks={findSubtasks} />;
};
