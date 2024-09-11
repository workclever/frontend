import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { useCreateBoardViewMutation } from "@app/services/api";
import { HttpResult } from "@app/components/shared/HttpResult";
import { Space } from "@app/components/shared/primitives/Space";
import { ViewIcon } from "lucide-react";
import { BoardViewType } from "@app/types/Project";
import { useDispatch } from "react-redux";
import { setSelectedBoardViewId } from "@app/slices/board/boardSlice";

type FormValuesType = {
  Type: BoardViewType;
  Name: string;
};

export const CreateBoardViewModal: React.FC<{
  boardId: number;
  onExit: () => void;
}> = ({ boardId, onExit }) => {
  const dispatch = useDispatch();
  const [createBoardView, { data: createResult, error: createError }] =
    useCreateBoardViewMutation();

  const onFinish = async (values: FormValuesType) => {
    const boardView = await createBoardView({
      BoardId: boardId,
      Type: values.Type,
      Name: values.Name,
    }).unwrap();

    if (boardView.Data.Id) {
      dispatch(setSelectedBoardViewId(boardView.Data.Id));
      onExit();
    }
  };

  return (
    <ModalForm<FormValuesType>
      title={
        <Space>
          <ViewIcon size={15} />
          <span>Create new board view</span>
        </Space>
      }
      open
      autoFocusFirstInput
      modalProps={{
        width: 400,
        cancelText: "Cancel",
        okText: "Save",
        onCancel: onExit,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProFormSelect
        name="Type"
        label="Type"
        placeholder="Type"
        rules={[{ required: true, message: "Select a board view type" }]}
        options={[
          { label: "Kanban", value: "kanban" },
          { label: "Tree", value: "tree" },
        ]}
      />
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
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
