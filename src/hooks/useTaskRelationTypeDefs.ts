import { useListTaskRelationTypeDefsQuery } from "../services/api";

export const useTaskRelationTypeDefs = () => {
  const { data } = useListTaskRelationTypeDefsQuery(null);

  return data?.Data || [];
};
