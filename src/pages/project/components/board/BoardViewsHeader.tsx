import {
  selectBoardViewType,
  setBoardViewType,
} from "@app/slices/board/boardSlice";
import { BoardViewType } from "@app/types/Project";
import { Segmented } from "antd";
import { SquareDashedKanbanIcon, NetworkIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export const BoardViewsHeader = () => {
  const dispatch = useDispatch();
  const boardViewType = useSelector(selectBoardViewType);

  const updateBoardViewType = (type: BoardViewType) => {
    dispatch(setBoardViewType(type));
  };

  return (
    <div style={{ padding: 8 }}>
      <Segmented
        size="small"
        value={boardViewType}
        onChange={(e) => updateBoardViewType(e as BoardViewType)}
        options={[
          {
            value: "kanban",
            icon: <SquareDashedKanbanIcon size={12} />,
            label: "Kanban",
          },
          {
            value: "tree",
            icon: <NetworkIcon size={12} />,
            label: "Tree",
          },
        ]}
      />
    </div>
  );
};
