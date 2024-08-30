import { call, put, take, takeEvery } from "redux-saga/effects";
import { goToProject } from "./projectSlice";
import { history } from "../../history";
import { api } from "../../services/api";
import { BoardType } from "../../types/Project";
import { RtkQueryOutput } from "../types";

function* handleGoToProject({ payload }: ReturnType<typeof goToProject>) {
  try {
    yield put(
      api.endpoints.listAllBoards.initiate(null, { forceRefetch: true })
    );
    const data: RtkQueryOutput<BoardType[]> = yield take(
      api.endpoints.listAllBoards.matchFulfilled
    );

    const boardId = data.payload.Data.find((r) => r.ProjectId === payload)?.Id;
    if (boardId) {
      const url = `/project/${payload}/board/${boardId}`;
      yield call(history.push, url);
    }
  } catch (e) {
    console.log({ e });
  }
}

export function* projectSaga() {
  yield takeEvery(goToProject, handleGoToProject);
}
