import { call, put, take, takeEvery } from "redux-saga/effects";
import { history } from "../../history";
import { api } from "../../services/api";
import { BoardType } from "../../types/Project";
import { RtkQueryOutput } from "../types";
import { goToBoard, goToProject, goToTask } from "./navigateSlice";
import { setSelectedProjectId } from "../project/projectSlice";

function* handleGoToProject({
  payload: projectId,
}: ReturnType<typeof goToProject>) {
  try {
    yield put(
      api.endpoints.listAllBoards.initiate(null, { forceRefetch: true })
    );
    const data: RtkQueryOutput<BoardType[]> = yield take(
      api.endpoints.listAllBoards.matchFulfilled
    );

    const boardId = data.payload.Data.find(
      (r) => r.ProjectId === projectId
    )?.Id;
    if (boardId) {
      const url = `/project/${projectId}/board/${boardId}`;
      yield call(history.push, url);
    }
  } catch (e) {
    console.log({ e });
  }
}

function* handleGoToBoard({ payload: board }: ReturnType<typeof goToBoard>) {
  try {
    yield put(setSelectedProjectId(board.ProjectId));
    const url = `/project/${board.ProjectId}/board/${board.Id}`;
    yield call(history.push, url);
  } catch (e) {
    console.log({ e });
  }
}

function* handleGoToTask({ payload: task }: ReturnType<typeof goToTask>) {
  try {
    const url = `/task/${task.Slug}`;
    yield call(history.push, url);
  } catch (e) {
    console.log({ e });
  }
}

export function* navigateSaga() {
  yield takeEvery(goToProject, handleGoToProject);
  yield takeEvery(goToBoard, handleGoToBoard);
  yield takeEvery(goToTask, handleGoToTask);
}
