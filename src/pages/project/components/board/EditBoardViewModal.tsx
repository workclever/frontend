import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { HttpResult } from "@app/components/shared/HttpResult";
import {
  useListCustomFieldsQuery,
  useUpdateBoardViewMutation,
} from "@app/services/api";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { BoardGroupableKey, BoardView } from "@app/types/Project";
import { Space } from "antd";
import { useSelector } from "react-redux";
import { CUSTOM_FIELD_PREFIX } from "./view/shared/constants";
import { CustomFieldType } from "@app/types/CustomField";

type FormValuesType = {
  Name: string;
  VisibleCustomFields: number[];
  GroupKey: BoardGroupableKey;
};

export const EditBoardViewDrawer: React.FC<{
  boardView: BoardView;
  onExit: () => void;
}> = ({ boardView, onExit }) => {
  const projectId = useSelector(selectSelectedProjectId);
  const [updateBoardView, { data: createResult, error: createError }] =
    useUpdateBoardViewMutation();

  const { data: customFields } = useListCustomFieldsQuery(Number(projectId));

  const onFinish = async (values: FormValuesType) => {
    await updateBoardView({
      BoardViewId: boardView.Id,
      Name: values.Name,
      VisibleCustomFields: values.VisibleCustomFields || [],
      GroupKey: values.GroupKey,
    });
  };

  const defaultGroupByOptions = [
    {
      label: "Column",
      value: "ColumnId",
    },
    {
      label: "Reporter",
      value: "ReporterUserId",
    },
  ];

  const customFieldGroupByOptions = () => {
    return (
      (customFields?.Data || [])
        // TODO user can't group by multi select options for now due to bug in kanban rendering
        .filter((r) => r.FieldType !== CustomFieldType.MultiSelect)
        .map((r) => {
          return { label: r.FieldName, value: `${CUSTOM_FIELD_PREFIX}${r.Id}` };
        })
    );
  };

  return (
    <DrawerForm<FormValuesType>
      title={
        <Space>
          <span>Update view: {boardView.Config.Name}</span>
        </Space>
      }
      open
      initialValues={{
        Name: boardView.Config.Name,
        VisibleCustomFields: boardView.Config.VisibleCustomFields,
        GroupKey: boardView.Config.GroupKey,
      }}
      autoFocusFirstInput
      drawerProps={{
        width: 400,
        onClose: onExit,
      }}
      submitter={{
        searchConfig: { submitText: "Update", resetText: "Cancel" },
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProFormText
        name="Name"
        label="Name"
        placeholder="Name"
        rules={[
          {
            required: true,
            message: "Required",
          },
        ]}
      />
      <ProFormSelect
        name="VisibleCustomFields"
        label="Visible custom fields"
        options={customFields?.Data.map((r) => {
          return {
            label: r.FieldName,
            value: r.Id,
          };
        })}
        mode="multiple"
        placeholder="Visible custom fields on each board view item"
      />
      <ProFormSelect
        name="GroupKey"
        label="Group by"
        options={[...defaultGroupByOptions, ...customFieldGroupByOptions()]}
        placeholder="Visible custom fields on each board view item"
      />
      <HttpResult error={createError} result={createResult} />
    </DrawerForm>
  );
};
