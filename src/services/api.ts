import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { authEndpoints } from "./endpoints/authEndpoints";
import { userEndpoints } from "./endpoints/userEndpoints";
import { projectEndpoints } from "./endpoints/projectEndpoints";
import { boardEndpoints } from "./endpoints/boardEndpoints";
import { columnEndpoints } from "./endpoints/columnEndpoint";
import { taskEndpoints } from "./endpoints/taskEndpoints";
import { taskCommentEndpoints } from "./endpoints/taskCommentEndpoints";
import { taskRelationEndpoints } from "./endpoints/taskRelationEndpoints";
import { taskRelationTypeDefEndpoints } from "./endpoints/taskRelationTypeDefEndpoints";
import { dictionaryEndpoints } from "./endpoints/dictionaryEndpoint";
import { siteSettingsEndpoints } from "./endpoints/siteSettingsEndpoints";
import { customFieldEndpoints } from "./endpoints/customFieldEndpoints";
import { API_URL } from "../constants";
import { selectAuthToken } from "../slices/auth/authSlice";
import { userNotificationEndpoints } from "./endpoints/userNotificationEndpoints";
import { TagTypes } from "./tags";

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAuthToken(getState() as RootState);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: TagTypes,
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...userEndpoints(builder),
    ...projectEndpoints(builder),
    ...boardEndpoints(builder),
    ...columnEndpoints(builder),
    ...taskEndpoints(builder),
    ...taskCommentEndpoints(builder),
    ...taskRelationEndpoints(builder),
    ...taskRelationTypeDefEndpoints(builder),
    ...dictionaryEndpoints(builder),
    ...siteSettingsEndpoints(builder),
    ...customFieldEndpoints(builder),
    ...userNotificationEndpoints(builder),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useListUserProjectsQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useCreateBoardColumnMutation,
  useUpdateBoardColumnMutation,
  useListProjectTasksQuery,
  useListBoardColumnsQuery,
  useListProjectUsersQuery,
  useMoveTaskToColumnMutation,
  useUpdateTaskPropertyMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useCreateSubtaskRelationMutation,
  useUpdateTaskAssigneeUserMutation,
  useListTaskChangeLogQuery,
  useListTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useGetTaskQuery,
  useCreateTaskRelationMutation,
  useSearchTasksMutation,
  useListTaskRelationsQuery,
  useDeleteTaskRelationMutation,
  useUpdateTaskRelationMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useListAllUsersQuery,
  useUpdateUserMutation,
  useUpdateUserPreferenceMutation,
  useCreateUserMutation,
  useGetUserRolesQuery,
  useGetAllRolesQuery,
  useAddUserToRolesMutation,
  useGetUserAssignedProjectIdsQuery,
  useCreateProjectAssigneeMutation,
  useRemoveProjectAssigneeMutation,
  useListMyAccessedEntitiesQuery,
  useListProjectUserAccessesQuery,
  useCreateManagerUserForProjectMutation,
  useDeleteManagerUserForProjectMutation,
  useCreateTaskRelationTypeDefMutation,
  useUpdateTaskRelationTypeDefMutation,
  useDeleteTaskRelationTypeDefMutation,
  useListTaskRelationTypeDefsQuery,
  useGetTimeZonesQuery,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingMutation,
  useListCustomFieldsQuery,
  useCreateCustomFieldMutation,
  useUpdateCustomFieldMutation,
  useDeleteCustomFieldMutation,
  useListTaskCustomFieldValuesByBoardQuery,
  useCreateCustomFieldTaskValueMutation,
  useListTaskAttachmentsQuery,
  useListUserNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useSetNotificationsReadMutation,
  useGetBoardQuery,
  useChangePasswordMutation,
  useUpdateColumnOrdersMutation,
  useUpdateTaskOrdersMutation,
  useSendTaskToTopOrBottomMutation,
  useListAllBoardsQuery,
  useDeleteColumnMutation,
} = api;
