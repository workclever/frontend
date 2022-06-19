import { useListBoardColumnsQuery } from "../services/api";

export const useColumns = (boardId: number) => {
  const { data, isLoading } = useListBoardColumnsQuery(boardId, {
    skip: !boardId,
  });
  return {
    columns: data?.Data || [],
    isLoading,
  };
};
