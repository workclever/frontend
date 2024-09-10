import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useCreateTaskMutation } from "@app/services/api";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { ColumnType } from "@app/types/Project";
import { ToggleOnClick } from "@app/components/shared/ToggleOnClick";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { gray } from "@ant-design/colors";
import { PlusIcon } from "lucide-react";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";

const TextWrapper = styled.span`
  color: ${gray[0]};
  cursor: pointer;
  font-size: 13px;

  &:hover {
    color: ${gray[5]};
  }
`;

type FormValuesType = {
  Title: string;
};

export const AddNewTaskInput: React.FC<{ column: ColumnType }> = ({
  column,
}) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [form] = Form.useForm();

  const onFinish = async (values: FormValuesType) => {
    await createTask({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      ColumnId: column.Id,
      Title: values.Title,
      Description: "",
    });
    form.resetFields();
  };

  const defaultComponent = (
    <Tooltip title={`Add a new task to ${column.Name} column`}>
      <TextWrapper>
        <PlusIcon size={12} /> New task
      </TextWrapper>
    </Tooltip>
  );
  const toggledComponent = (
    <Form<FormValuesType>
      form={form}
      initialValues={{
        Title: "",
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="Title"
        rules={[{ required: true, message: "Please enter title" }]}
      >
        <Input
          autoFocus
          placeholder="Create a new task..."
          disabled={isLoading}
        />
      </Form.Item>
    </Form>
  );

  return (
    <ToggleOnClick
      defaultComponent={defaultComponent}
      toggledComponent={toggledComponent}
    />
  );
};
