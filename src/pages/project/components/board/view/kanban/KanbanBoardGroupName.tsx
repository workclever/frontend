import { styled } from "styled-components";
import { BoardGroupableKey } from "@app/types/Project";
import { GroupItem } from "@ozgurrgul/dragulax";
import { GroupName } from "../shared/GroupNameRenderer";

const Wrapper = styled.div`
  background-color: transparent;
  padding: 8px;
  cursor: pointer;
  width: 100%;
`;

export const KanbanBoardGroupName: React.FC<{
  groupBy: BoardGroupableKey;
  group: GroupItem;
}> = ({ groupBy, group }) => {
  return (
    <Wrapper>
      <div style={{ display: "flex", flex: 1, color: "gray" }}>
        <GroupName groupBy={groupBy} group={group} />
      </div>
    </Wrapper>
  );
};
