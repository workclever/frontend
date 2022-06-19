import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "../../../../components/shared/TaskIdRenderer";
import { Text } from "../../../../components/shared/primitives/Text";
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
  margin-bottom: 8px;
  padding: 16px;
  cursor: pointer;
  border: 1px solid var(--gray3);
  background-color: var(--gray2);
  border-radius: 4px;

  &:hover {
    background-color: var(--purple2);
    border-color: var(--purple3);
  }
`;

export const TaskCardKanban: React.FC<Props> = ({
  task,
  listeners,
  customFields,
  findSubtasks,
}) => {
  return (
    <Wrapper {...listeners}>
      <div>
        <Text>{task.Title}</Text>
      </div>
      <Space style={{ paddingTop: 4 }}>
        <TaskIdRenderer task={task} />
        <TaskSubtasksUnit task={task} findSubtasks={findSubtasks} />
        <TaskCommentsUnit task={task} />
        <TaskAssigneeUnit task={task} />
      </Space>
      <div style={{ paddingTop: 4 }}>
        <RenderTaskCustomFieldsUnit task={task} customFields={customFields} />
      </div>
    </Wrapper>
  );
};
