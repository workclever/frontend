import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoggedInLayout } from "../../layout/LoggedInLayout";
import {
  selectSelectedBoardId,
  setSelectedBoardId,
  setSelectedProjectId,
  setSelectedTaskId,
} from "../../slices/projectSlice";
import { Outlet, useParams } from "react-router-dom";
import styled from "styled-components";
import { useBoards } from "../../hooks/useBoards";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { LayoutWithHeader } from "../../layout/LayoutWithHeader";
import { BoardType } from "../../types/Project";
import { ShinyList } from "../../components/shared/ShinyList";
import { CreateBoardModal } from "./components/board/CreateBoardModal";
import { useCurrentProject } from "../../hooks/useCurrentProject";

const Inside = styled.div`
  margin-top: 8px;
`;

export const ProjectPage: React.FC = () => {
  const dispatch = useDispatch();
  const { projectId, boardId } = useParams();
  const project = useCurrentProject();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const boards = useBoards();
  const { goToBoard } = useAppNavigate();

  const params = new URLSearchParams(document.location.search);
  const taskId = params.get("taskId");

  React.useEffect(() => {
    if (projectId) {
      dispatch(setSelectedProjectId(Number(projectId)));
    }
  }, [projectId]);

  React.useEffect(() => {
    if (boardId) {
      dispatch(setSelectedBoardId(Number(boardId)));
    } else {
      dispatch(setSelectedBoardId(undefined));
    }
  }, [boardId]);

  React.useEffect(() => {
    if (taskId) {
      dispatch(setSelectedTaskId(Number(taskId)));
    }
  }, [taskId]);

  const [showCreateBoardModal, setShowCreateBoardModal] = React.useState(false);

  if (selectedBoardId) {
    return <Outlet />;
  }

  return (
    <LoggedInLayout>
      <LayoutWithHeader title="WorkClever">
        <Inside>
          <>
            <ShinyList<BoardType>
              title={`${project ? project.Name : ""}: Select a board`}
              dataSource={boards}
              nameProp="Name"
              onClick={(r) => goToBoard(r)}
              newButtonText="New board"
              onNewClick={() => setShowCreateBoardModal(true)}
              noDataText="This project doesn't have any boards, create now to be able manage your tasks!"
            />
            {showCreateBoardModal && (
              <CreateBoardModal
                onCancel={() => setShowCreateBoardModal(false)}
              />
            )}
          </>
        </Inside>
      </LayoutWithHeader>
    </LoggedInLayout>
  );
};
