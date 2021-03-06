import { PlusOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useCreateBoardColumnMutation } from "../../../../services/api";
import {
  selectSelectedProjectId,
  selectSelectedBoardId,
} from "../../../../slices/projectSlice";
import { ToggleOnClick } from "../../../../components/shared/ToggleOnClick";

const TextWrapper = styled.div`
  color: var(--gray9);
  cursor: pointer;
  width: 280px;

  &:hover {
    color: var(--mauve12);
  }
`;

export const AddNewColumnInput: React.FC = () => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [createBoardColumn, { isLoading }] = useCreateBoardColumnMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);

  const onFinish = async (values: any) => {
    await createBoardColumn({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      Name: values.Name,
      Hidden: false,
    });
  };

  const defaultComponent = (
    <TextWrapper>
      <PlusOutlined /> Add new column
    </TextWrapper>
  );
  const toggledComponent = (
    <Form
      name="basic"
      initialValues={{
        Name: "",
      }}
      onFinish={onFinish}
      autoComplete="off"
      style={{ width: 280 }}
    >
      <Form.Item
        name="Name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input autoFocus placeholder="Create new column" disabled={isLoading} />
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
