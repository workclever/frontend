import { PlusOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useCreateTaskMutation } from "../../../../services/api";
import {
  selectSelectedProjectId,
  selectSelectedBoardId,
} from "../../../../slices/projectSlice";
import { ColumnType } from "../../../../types/Project";
import { ToggleOnClick } from "../../../../components/shared/ToggleOnClick";
import { Tooltip } from "../../../../components/shared/primitives/Tooltip";

const TextWrapper = styled.span`
  color: var(--gray9);
  cursor: pointer;
  &:hover {
    color: var(--mauve12);
  }
`;

export const AddNewCardInput: React.FC<{ column: ColumnType }> = ({
  column,
}) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const onFinish = async (values: any) => {
    await createTask({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      ColumnId: column.Id,
      Title: values.Title,
      Description: "",
    });
  };

  const defaultComponent = (
    <Tooltip title={`Add new task to ${column.Name} column`}>
      <TextWrapper>
        <PlusOutlined /> Add new task
      </TextWrapper>
    </Tooltip>
  );
  const toggledComponent = (
    <Form
      name="basic"
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
