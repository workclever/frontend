import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Text } from "@app/components/shared/primitives/Text";
import { ColHeader } from "./ColumnTreeHeader";
import {
  Props,
  RenderTaskCustomFieldsUnit,
  TaskAssigneeUnit,
  TaskCommentsUnit,
} from "./Task";
import { Space } from "@app/components/shared/primitives/Space";
import { blue } from "@ant-design/colors";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-bottom: 0px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 100ms ease-in;
  border-bottom: 1px solid #eaeaea;

  &:hover {
    background-color: ${blue[0]};
  }
`;

export const TaskCardTree: React.FC<Props> = ({ task, customFields }) => {
  return (
    <Wrapper>
      <div style={{ display: "flex", alignItems: "" }}>
        <Space style={{ flex: 1 }}>
          <TaskIdRenderer task={task} />
          <Text style={{ minWidth: 200, display: "block", textAlign: "left" }}>
            {task.Title}
          </Text>
        </Space>
        <div style={{ display: "flex", alignItems: "center" }}>
          <RenderTaskCustomFieldsUnit task={task} customFields={customFields} />
          <ColHeader>
            <TaskCommentsUnit task={task} />
          </ColHeader>
          <ColHeader>
            <TaskAssigneeUnit task={task} />
          </ColHeader>
        </div>
      </div>
    </Wrapper>
  );
};
