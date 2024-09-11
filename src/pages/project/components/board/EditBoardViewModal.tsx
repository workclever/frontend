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
import { BoardView } from "@app/types/Project";
import { Space } from "antd";
import { useSelector } from "react-redux";

type FormValuesType = {
  Name: string;
  VisibleCustomFields: number[];
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
    });
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
      <HttpResult error={createError} result={createResult} />
    </DrawerForm>
  );
};
