import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import { HttpResult } from "../../../../components/shared/HttpResult";
import { useAppNavigate } from "../../../../hooks/useAppNavigate";
import { useCreateBoardMutation } from "../../../../services/api";
import { selectSelectedProjectId } from "../../../../slices/projectSlice";

type CreateProjectModalInput = {
  Name: string;
};

export const CreateBoardModal: React.FC<{ onCancel: () => void }> = ({
  onCancel,
}) => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { goToBoard } = useAppNavigate();
  const [createBoard, { error: createError, data: createResult }] =
    useCreateBoardMutation();

  const onFinish = async (values: CreateProjectModalInput) => {
    const result = await createBoard({
      Name: values.Name,
      ProjectId: Number(selectedProjectId),
    }).unwrap();
    if (result.Succeed) {
      onCancel();
      goToBoard(result.Data);
    }
  };

  return (
    <ModalForm<CreateProjectModalInput>
      title={"Create new board"}
      visible
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
