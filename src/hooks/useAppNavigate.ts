import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedTaskId } from "../slices/project/projectSlice";
import { BoardType, TaskType } from "../types/Project";
import { goToProject, goToTask } from "@app/slices/navigate/navigateSlice";

export const useAppNavigate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return {
    goToProject: (projectId: number) => {
      dispatch(goToProject(projectId));
    },
    goToBoard: (board: BoardType) => {
      navigate(`/project/${board.ProjectId}/board/${board.Id}`);
      dispatch(setSelectedTaskId(undefined));
    },
    goToTask: (task: TaskType) => {
      dispatch(goToTask(task));
    },
  };
};
