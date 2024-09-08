import { put, select, take, takeEvery } from "redux-saga/effects";
import {
  loadBoardStarted,
  loadBoardFinished,
  selectSelectedBoardId,
} from "./boardSlice";
import { api } from "../../services/api";

const queryConfig = {
  forceRefetch: true,
};

function* handleLoadBoardStarted({
  payload,
}: ReturnType<typeof loadBoardStarted>) {
  try {
    yield select(selectSelectedBoardId);
    yield put(
      api.endpoints.listCustomFields.initiate(payload.projectId, queryConfig)
    );
    yield put(
      api.endpoints.listTaskCustomFieldValuesByBoard.initiate(
        payload.boardId,
        queryConfig
      )
    );
    yield take([api.endpoints.listCustomFields.matchFulfilled]);
    yield take([api.endpoints.listTaskCustomFieldValuesByBoard.matchFulfilled]);
    yield put(loadBoardFinished());
  } catch (e) {
    console.log({ e });
  }
}
export function* boardSaga() {
  yield takeEvery(loadBoardStarted, handleLoadBoardStarted);
  // yield takeEvery(loadBoardFinished, handleLoadBoardFinished);
}
