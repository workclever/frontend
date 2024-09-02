import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "../../../../components/shared/TaskIdRenderer";
import { Text } from "../../../../components/shared/primitives/Text";
import { ColHeader } from "./ColumnListHeader";
import {
  Props,
  RenderTaskCustomFieldsUnit,
  TaskAssigneeUnit,
  TaskCommentsUnit,
  TaskSubtasksUnit,
} from "./Task";
import { Space } from "../../../../components/shared/primitives/Space";
import { blue } from "@ant-design/colors";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  margin-bottom: 0px;
  cursor: pointer;
  padding: 4px 8px;
  border-bottom: 1px solid #eaeaea;

  &:hover {
    background-color: ${blue[0]};
  }
`;

export const TaskCardCompact: React.FC<Props> = ({
  task,
  listeners,
  customFields,
  findSubtasks,
}) => {
  return (
    <Wrapper {...listeners}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <Space>
            <TaskIdRenderer task={task} />
            <Text>{task.Title}</Text>
          </Space>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <RenderTaskCustomFieldsUnit task={task} customFields={customFields} />
          <ColHeader>
            <TaskCommentsUnit task={task} />
          </ColHeader>
          <ColHeader>
            <TaskSubtasksUnit task={task} findSubtasks={findSubtasks} />
          </ColHeader>
          <ColHeader>
            <TaskAssigneeUnit task={task} />
          </ColHeader>
        </div>
      </div>
    </Wrapper>
  );
};
