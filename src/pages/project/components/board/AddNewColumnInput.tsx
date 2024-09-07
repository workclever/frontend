import { PlusOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useCreateBoardColumnMutation } from "@app/services/api";
import {
  selectSelectedProjectId,
  selectSelectedBoardId,
} from "@app/slices/project/projectSlice";
import { ToggleOnClick } from "@app/components/shared/ToggleOnClick";
import { gray } from "@ant-design/colors";

const TextWrapper = styled.div`
  cursor: pointer;
  width: 280px;
  color: ${gray[0]};
  &:hover {
    color: ${gray[5]};
  }
`;

type FormValuesType = { Name: string };

export const AddNewColumnInput: React.FC = () => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [createBoardColumn, { isLoading }] = useCreateBoardColumnMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [form] = Form.useForm();

  const onFinish = async (values: FormValuesType) => {
    await createBoardColumn({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      Name: values.Name,
      Hidden: false,
    });
    form.resetFields();
  };

  const defaultComponent = (
    <TextWrapper>
      <PlusOutlined /> New column
    </TextWrapper>
  );

  const toggledComponent = (
    <Form<FormValuesType>
      form={form}
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
