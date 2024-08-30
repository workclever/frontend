import { useSelector } from "react-redux";
import { useListProjectUsersQuery } from "../services/api";
import { selectSelectedProjectId } from "../slices/project/projectSlice";

export const useProjectUsers = () => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { data: users, isLoading } = useListProjectUsersQuery(
    Number(selectedProjectId),
    {
      skip: !selectedProjectId,
    }
  );

  const usersData = users?.Data || [];

  return {
    users: usersData,
    isLoading,
  };
};
