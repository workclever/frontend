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

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--gray2);
  margin-bottom: 0px;
  cursor: pointer;
  border-bottom: 1px solid var(--gray3);
  padding-left: 8px;

  &:hover {
    background-color: var(--purple2);
    border-color: var(--purple3);
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
        <div style={{ display: "flex" }}>
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
