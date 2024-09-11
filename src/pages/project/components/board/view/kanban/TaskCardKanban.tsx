import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { Props } from "../../Task";
import { Space } from "@app/components/shared/primitives/Space";
import { blue } from "@ant-design/colors";
import { TaskAssigneeUnit } from "../../units/TaskAssigneeUnit";
import { TaskSubtasksUnit } from "../../units/TaskSubtasksUnit";
import { TaskCommentsUnit } from "../../units/TaskCommentsUnit";
import { RenderTaskCustomFieldsUnit } from "../../units/RenderTaskCustomFieldsUnit";

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
  box-shadow: var(--box-shadow);
  transition: all 100ms ease-in;

  &:hover {
    background-color: ${blue[0]};
  }
`;

export const TaskCardKanban: React.FC<
  Pick<Props, "task" | "customFields" | "findSubtasks">
> = ({ task, customFields, findSubtasks }) => {
  return (
    <Wrapper>
      <div>
        <div
          style={{
            minWidth: 200,
            display: "block",
            textAlign: "left",
            color: "#2a2a2a",
            fontWeight: "500",
            fontSize: 13,
          }}
        >
          {task.Title}
        </div>
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
