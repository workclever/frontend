import { useSelector } from "react-redux";
import { useGetProjectQuery } from "../services/api";
import { selectSelectedProjectId } from "../slices/projectSlice";

export const useCurrentProject = () => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { data } = useGetProjectQuery(Number(selectedProjectId), {
    skip: !selectedProjectId,
  });
  return data?.Data;
};
