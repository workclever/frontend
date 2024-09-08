import { delay, put, takeEvery } from "redux-saga/effects";
import { loadBoardStarted, loadBoardFinished } from "./boardSlice";

function* handleLoadBoardStarted() {
  try {
    // Simulate loading data effect to prevent page appearing very fast
    yield delay(200);
    yield put(loadBoardFinished());
  } catch (e) {
    console.log({ e });
  }
}
export function* boardSaga() {
  yield takeEvery(loadBoardStarted, handleLoadBoardStarted);
}
