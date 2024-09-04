import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { HttpResult } from "@app/components/shared/HttpResult";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useCreateBoardMutation } from "@app/services/api";

type FormValuesType = {
  Name: string;
};

export const CreateBoardModal: React.FC<{
  onCancel: () => void;
  projectId: number;
}> = ({ onCancel, projectId }) => {
  const { goToBoard } = useAppNavigate();
  const [createBoard, { error: createError, data: createResult }] =
    useCreateBoardMutation();

  const onFinish = async (values: FormValuesType) => {
    const result = await createBoard({
      Name: values.Name,
      ProjectId: projectId,
    }).unwrap();
    if (result.Succeed) {
      onCancel();
      goToBoard(result.Data);
    }
  };

  return (
    <ModalForm<FormValuesType>
      title={"Create new board"}
      open
      autoFocusFirstInput
      modalProps={{
        width: 300,
        cancelText: "Cancel",
        okText: "Save",
        onCancel,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="Name"
          label="Name"
          placeholder="Board name"
          rules={[{ required: true, message: "Name of the board" }]}
        />
      </ProForm.Group>
      <HttpResult error={createError} result={createResult} />
    </ModalForm>
  );
};
