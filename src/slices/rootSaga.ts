import { fork } from "redux-saga/effects";
import { projectSaga } from "./project/projectSaga";
import { appSaga } from "./project/appSaga";

export function* rootSaga() {
  yield fork(projectSaga);
  yield fork(appSaga);
}
