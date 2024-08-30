import { fork } from "redux-saga/effects";
import { projectSaga } from "./project/projectSaga";

export function* rootSaga() {
  yield fork(projectSaga);
}
