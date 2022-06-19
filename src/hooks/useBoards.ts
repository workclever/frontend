import { useSelector } from "react-redux";
import { useListAllBoardsQuery } from "../services/api";
import { selectSelectedProjectId } from "../slices/projectSlice";

export const useBoards = () => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { data } = useListAllBoardsQuery(null, {
    skip: !selectedProjectId,
  });

  return (data?.Data || []).filter(
    (r) => r.ProjectId === Number(selectedProjectId)
  );
};
