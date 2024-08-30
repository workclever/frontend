import { BaseOutput } from "../../types/BaseOutput";
import { UserNotificationType } from "../../types/User";
import { Builder } from "../types";

export const userNotificationEndpoints = (builder: Builder) => ({
  listUserNotifications: builder.query<
    BaseOutput<UserNotificationType[]>,
    number
  >({
    query: (limit) => ({
      url: `/UserNotification/ListUserNotifications?limit=${limit}`,
    }),
    providesTags: ["UserNotifications"],
  }),
  getUnreadNotificationsCount: builder.query<BaseOutput<number>, null>({
    query: () => ({ url: `/UserNotification/GetUnreadNotificationsCount` }),
    providesTags: ["UnreadNotificationsCount"],
  }),
  setNotificationsRead: builder.mutation<BaseOutput<string>, null>({
    query: () => ({
      url: "/UserNotification/SetNotificationsRead",
      method: "POST",
    }),
    invalidatesTags: ["UnreadNotificationsCount"],
  }),
});
