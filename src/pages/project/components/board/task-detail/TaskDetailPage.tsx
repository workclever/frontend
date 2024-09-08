import { useParams } from "react-router-dom";
import { TaskDetail } from "./TaskDetail";
import { useGetTaskQuery } from "@app/services/api";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { BoardLayout } from "../BoardLayout";
import { useBoardData } from "../hooks/useBoardData";
import { loadTaskDetailStarted } from "@app/slices/taskDetail/taskDetailSlice";

export const TaskDetailPage = () => {
  const dispatch = useDispatch();
  const { taskId: taskIdString } = useParams();
  const taskId = Number(taskIdString?.split("-")[1]);
  const { data: task } = useGetTaskQuery(taskId, { skip: !taskId });
  const { findSubtasks } = useBoardData(Number(task?.Data.ProjectId));

  useEffect(() => {
    if (task?.Data) {
      dispatch(loadTaskDetailStarted({ task: task.Data }));
    }
  }, [dispatch, task]);

  return (
    <BoardLayout
      mode="task"
      projectId={task?.Data.ProjectId}
      boardId={task?.Data.BoardId}
    >
      {task?.Data && (
        <TaskDetail task={task.Data} findSubtasks={findSubtasks} />
      )}
    </BoardLayout>
  );
};
