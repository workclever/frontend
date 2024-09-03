import { PlusOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useCreateTaskMutation } from "@app/services/api";
import {
  selectSelectedProjectId,
  selectSelectedBoardId,
} from "@app/slices/project/projectSlice";
import { ColumnType } from "@app/types/Project";
import { ToggleOnClick } from "@app/components/shared/ToggleOnClick";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";
import { gray } from "@ant-design/colors";

const TextWrapper = styled.span`
  color: ${gray[0]};
  cursor: pointer;
  &:hover {
    color: ${gray[5]};
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
    <Tooltip title={`Add a new task to ${column.Name} column`}>
      <TextWrapper>
        <PlusOutlined /> New task
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
