import { useDispatch } from "react-redux";
import { BoardType, TaskType } from "../types/Project";
import {
  goToBoard,
  goToProject,
  goToTask,
} from "@app/slices/navigate/navigateSlice";

export const useAppNavigate = () => {
  const dispatch = useDispatch();

  return {
    goToProject: (projectId: number) => {
      dispatch(goToProject(projectId));
    },
    goToBoard: (board: BoardType) => {
      dispatch(goToBoard(board));
    },
    goToTask: (task: TaskType) => {
      dispatch(goToTask(task));
    },
  };
};
