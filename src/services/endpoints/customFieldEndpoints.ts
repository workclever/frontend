import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseOutput } from "../../types/BaseOutput";
import {
  CustomField,
  CustomFieldSelectOption,
  CustomFieldType,
  TaskCustomFields,
} from "../../types/CustomField";

export const customFieldEndpoints = (
  builder: EndpointBuilder<ReturnType<any>, string, "api">
) => ({
  listCustomFields: builder.query<BaseOutput<CustomField[]>, number>({
    query: (id) => ({ url: `/CustomField/ListCustomFields?projectId=${id}` }),
    providesTags: ["CustomField"],
  }),
  listTaskCustomFieldValuesByBoard: builder.query<
    BaseOutput<TaskCustomFields>,
    number
  >({
    query: (id) => ({
      url: `/CustomField/ListTaskCustomFieldValuesByBoard?boardId=${id}`,
    }),
    providesTags: ["TaskCustomFieldValues"],
  }),
  createCustomField: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      FieldName: string;
      FieldType: CustomFieldType;
      ShowInTaskCard: boolean;
      Enabled: boolean;
      SelectOptions: CustomFieldSelectOption[];
    }
  >({
    query: (body) => ({
      url: `/CustomField/CreateCustomField`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["CustomField", "TaskCustomFieldValues"],
  }),
  updateCustomField: builder.mutation<
    BaseOutput<string>,
    {
      CustomFieldId: number;
      FieldName: string;
      FieldType: CustomFieldType;
      ShowInTaskCard: boolean;
      Enabled: boolean;
      SelectOptions: CustomFieldSelectOption[];
    }
  >({
    query: (body) => ({
      url: `/CustomField/UpdateCustomField`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["CustomField", "TaskCustomFieldValues"],
  }),
  deleteCustomField: builder.mutation<
    BaseOutput<string>,
    {
      ProjectId: number;
      CustomFieldId: number;
    }
  >({
    query: ({ ProjectId, CustomFieldId }) => ({
      url: `/CustomField/DeleteCustomField?projectId=${ProjectId}&customFieldId=${CustomFieldId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["CustomField", "TaskCustomFieldValues"],
  }),
  createCustomFieldTaskValue: builder.mutation<
    BaseOutput<string>,
    {
      TaskId: number;
      CustomFieldId: number;
      Value: string;
    }
  >({
    query: (body) => ({
      url: `/CustomField/CreateCustomFieldTaskValue`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["TaskCustomFieldValues"],
  }),
});
