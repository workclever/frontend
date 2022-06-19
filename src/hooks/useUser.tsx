import { useListAllUsersQuery } from "../services/api";
import { useMe } from "./useMe";

export const useUser = (userId: number) => {
  const { data } = useListAllUsersQuery(null);
  const { me } = useMe();
  const foundUser = (data?.Data || []).find((r) => r.Id === userId);

  return {
    user: foundUser,
    isMe: me?.Id === foundUser?.Id,
  };
};
