import { fork } from "redux-saga/effects";
import { appSaga } from "./project/appSaga";
import { navigateSaga } from "./project/navigateSaga";
import { taskDetailSaga } from "./project/taskDetailSaga";

export function* rootSaga() {
  yield fork(appSaga);
  yield fork(navigateSaga);
  yield fork(taskDetailSaga);
}
