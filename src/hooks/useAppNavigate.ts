import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedTaskId } from "../slices/projectSlice";
import { BoardType, TaskType } from "../types/Project";

export const useAppNavigate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return {
    goToProject: (projectId: number) => {
      navigate(`/project/${projectId}`);
    },
    goToBoard: (board: BoardType) => {
      navigate(`/project/${board.ProjectId}/board/${board.Id}`);
      dispatch(setSelectedTaskId(undefined));
    },
    goToTask: (task: TaskType) => {
      navigate(
        `/project/${task.ProjectId}/board/${task.BoardId}?taskId=${task.Id}`
      );
    },
  };
};
