import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Text } from "@app/components/shared/primitives/Text";
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
  margin-bottom: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: white;
  border-radius: 4px;
  filter: drop-shadow(0px 1px 1px #eaeaea);
  transition: all 100ms ease-in;

  &:hover {
    background-color: ${blue[0]};
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
