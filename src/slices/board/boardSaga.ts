import { put, select, take, takeEvery } from "redux-saga/effects";
import { loadBoardStarted, loadBoardFinished } from "./boardSlice";
import { api } from "../../services/api";
import {
  selectSelectedBoardId,
  selectSelectedProjectId,
} from "../project/projectSlice";

const queryConfig = {
  forceRefetch: true,
};

function* handleLoadBoardStarted() {
  try {
    const selectedProjectId: ReturnType<typeof selectSelectedProjectId> =
      yield select(selectSelectedProjectId);
    const selectedBoardId: ReturnType<typeof selectSelectedProjectId> =
      yield select(selectSelectedBoardId);
    yield put(
      api.endpoints.listCustomFields.initiate(
        Number(selectedProjectId),
        queryConfig
      )
    );
    yield put(
      api.endpoints.listTaskCustomFieldValuesByBoard.initiate(
        Number(selectedBoardId),
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
