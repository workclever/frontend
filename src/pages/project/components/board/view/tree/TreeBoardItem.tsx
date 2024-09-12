import React from "react";
import styled from "styled-components";
import { TaskIdRenderer } from "@app/components/shared/TaskIdRenderer";
import { gray } from "@ant-design/colors";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { TreeItem } from "@ozgurrgul/dragulax";
import { Props } from "../../Task";
import { RenderTaskCustomFieldsUnit } from "../../units/RenderTaskCustomFieldsUnit";
import { TaskAssigneeUnit } from "../../units/TaskAssigneeUnit";
import { TaskCommentsUnit } from "../../units/TaskCommentsUnit";
import { ColHeader } from "./ColumnTreeHeader";
import { Space } from "@app/components/shared/primitives/Space";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-bottom: 0px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 100ms ease-in;
  border-bottom: 1px solid #efefef;

  &:hover {
    background-color: #fafafa;
  }
`;

const ArrowIcon = ({
  item,
  onClick,
}: {
  item: TreeItem;
  onClick: React.MouseEventHandler;
}) => {
  if (!item.children.length) {
    return <div style={{ width: 12, height: 12 }}>&nbsp;</div>;
  }
  return item.isOpen ? (
    <ChevronDownIcon onClick={onClick} size={12} style={{ color: gray[0] }} />
  ) : (
    <ChevronRightIcon onClick={onClick} size={12} style={{ color: gray[0] }} />
  );
};

interface TreeBoardItemProps extends Pick<Props, "task" | "customFields"> {
  treeItem: TreeItem;
  toggleOpen: () => void;
}

export const TreeBoardItem: React.FC<TreeBoardItemProps> = ({
  treeItem,
  task,
  customFields,
  toggleOpen,
}) => {
  return (
    <Wrapper>
      <div style={{ display: "flex", alignItems: "" }}>
        <Space style={{ flex: 1 }}>
          <ArrowIcon
            item={treeItem}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleOpen();
            }}
          />
          <TaskIdRenderer task={task} />
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
