import { useListBoardViewsByBoardIdQuery } from "@app/services/api";
import {
  selectSelectedBoardViewId,
  setSelectedBoardViewId,
} from "@app/slices/board/boardSlice";
import { BoardViewType } from "@app/types/Project";
import { Segmented } from "antd";
import { SquareDashedKanbanIcon, NetworkIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateBoardViewModal } from "./CreateBoardViewModal";
import { Button } from "@app/components/shared/primitives/Button";

const Icons: { [boardViewType in BoardViewType]: React.ReactNode } = {
  kanban: <SquareDashedKanbanIcon size={12} />,
  tree: <NetworkIcon size={12} />,
};

export const BoardViewsHeader: React.FC<{ boardId: number }> = ({
  boardId,
}) => {
  const dispatch = useDispatch();
  const selectedBoardViewId = useSelector(selectSelectedBoardViewId);
  const { data } = useListBoardViewsByBoardIdQuery(boardId);
  const boardViews = data?.Data || [];

  const [showCreateBoardViewModal, setShowCreateBoardViewModal] =
    useState(false);

  const options = boardViews.map((boardView) => {
    return {
      value: boardView.Id,
      icon: Icons[boardView.Config.Type],
      label: "noname",
    };
  });

  return (
    <>
      <div style={{ padding: 8, display: "flex", alignItems: "center" }}>
        <Segmented
          value={selectedBoardViewId}
          onChange={(e) => {
            dispatch(setSelectedBoardViewId(e));
          }}
          options={options}
        />
        <Button
          type="dashed"
          style={{ marginLeft: 4 }}
          onClick={() => setShowCreateBoardViewModal(true)}
        >
          New view <PlusIcon size={12} />
        </Button>
      </div>
      {showCreateBoardViewModal && (
        <CreateBoardViewModal
          boardId={boardId}
          onExit={() => setShowCreateBoardViewModal(false)}
        />
      )}
    </>
  );
};
