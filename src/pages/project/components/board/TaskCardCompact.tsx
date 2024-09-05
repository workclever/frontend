import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Text } from "@app/components/shared/primitives/Text";
import { ColHeader } from "./ColumnListHeader";
import {
  Props,
  RenderTaskCustomFieldsUnit,
  TaskAssigneeUnit,
  TaskCommentsUnit,
  TaskSubtasksUnit,
} from "./Task";
import { Space } from "@app/components/shared/primitives/Space";
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
  filter: drop-shadow(0px 1px 1px #eaeaea);
  transition: all 100ms ease-in;

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
