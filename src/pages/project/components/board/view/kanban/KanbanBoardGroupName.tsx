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
  groupId: number;
}> = ({ groupBy, group, groupId }) => {
  return (
    <Wrapper>
      <div
        style={{ display: "flex", flex: 1, marginBottom: 0, color: "black" }}
      >
        <GroupName groupBy={groupBy} group={group} groupId={groupId} />
      </div>
    </Wrapper>
  );
};
