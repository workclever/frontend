import { useParams } from "react-router-dom";
import { TaskDetail } from "./TaskDetail";
import { useGetTaskQuery } from "@app/services/api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadTaskDetailStarted } from "@app/slices/project/taskDetailSlice";
import { BoardLayout } from "../BoardLayout";
import { useBoardData } from "@app/hooks/useBoardData";

export const TaskDetailPage = () => {
  const dispatch = useDispatch();
  const { taskId: taskIdString } = useParams();
  const taskId = Number(taskIdString?.split("-")[1]);
  const { data: task } = useGetTaskQuery(taskId, { skip: !taskId });
  const { findSubtasks, onTaskDelete } = useBoardData();

  useEffect(() => {
    dispatch(loadTaskDetailStarted({ taskId }));
  }, [dispatch, taskId]);

  return (
    <BoardLayout>
      {task?.Data && (
        <TaskDetail
          task={task.Data}
          onTaskDelete={onTaskDelete}
          findSubtasks={findSubtasks}
        />
      )}
    </BoardLayout>
  );
};
