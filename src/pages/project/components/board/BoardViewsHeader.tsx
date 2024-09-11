import { useListBoardViewsByBoardIdQuery } from "@app/services/api";
import {
  selectSelectedBoardViewId,
  setSelectedBoardViewId,
} from "@app/slices/board/boardSlice";
import { BoardView, BoardViewType } from "@app/types/Project";
import { Segmented, SegmentedProps } from "antd";
import {
  SquareDashedKanbanIcon,
  NetworkIcon,
  ViewIcon,
  SettingsIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateBoardViewModal } from "./CreateBoardViewModal";
import { Button } from "@app/components/shared/primitives/Button";
import { EditBoardViewDrawer } from "./EditBoardViewModal";

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
  const [showEditBoardViewModal, setShowEditeBoardViewModal] = useState(false);

  const options: SegmentedProps["options"] = boardViews.map((boardView) => {
    return {
      value: boardView.Id,
      icon: Icons[boardView.Config.Type],
      label: boardView.Config.Name,
    };
  });

  return (
    <>
      <div
        style={{
          padding: 8,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Segmented
          value={selectedBoardViewId}
          onChange={(e) => {
            dispatch(setSelectedBoardViewId(e as number));
          }}
          options={options}
        />
        <Button
          type="dashed"
          style={{ marginLeft: 4 }}
          size="small"
          onClick={() => setShowCreateBoardViewModal(true)}
        >
          New view <ViewIcon size={12} />
        </Button>
        <div style={{ flex: 1 }}></div>
        {selectedBoardViewId && (
          <Button type="text" onClick={() => setShowEditeBoardViewModal(true)}>
            Customize <SettingsIcon size={12} />
          </Button>
        )}
      </div>
      {showCreateBoardViewModal && (
        <CreateBoardViewModal
          boardId={boardId}
          onExit={() => setShowCreateBoardViewModal(false)}
        />
      )}
      {showEditBoardViewModal && selectedBoardViewId && (
        <EditBoardViewDrawer
          boardView={
            boardViews.find((r) => r.Id === selectedBoardViewId) as BoardView
          }
          onExit={() => setShowEditeBoardViewModal(false)}
        />
      )}
    </>
  );
};
