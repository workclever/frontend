import { fork } from "redux-saga/effects";
import { appSaga } from "./app/appSaga";
import { navigateSaga } from "./navigate/navigateSaga";
import { taskDetailSaga } from "./taskDetail/taskDetailSaga";

export function* rootSaga() {
  yield fork(appSaga);
  yield fork(navigateSaga);
  yield fork(taskDetailSaga);
}
