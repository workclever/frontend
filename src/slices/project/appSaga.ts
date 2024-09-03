import { put, take, takeEvery } from "redux-saga/effects";
import { loadAppFinished, loadAppStarted } from "./appSlice";
import { api } from "../../services/api";

const queryConfig = {
  forceRefetch: true,
};

function* handleLoadAppStarted() {
  try {
    yield put(api.endpoints.getUser.initiate(null, queryConfig));
    yield put(
      api.endpoints.listMyAccessedEntities.initiate(null, {
        forceRefetch: true,
      })
    );
    yield put(api.endpoints.getSiteSettings.initiate(null, queryConfig));
    yield put(api.endpoints.listUserProjects.initiate(null, queryConfig));
    yield take([
      api.endpoints.getUser.matchFulfilled,
      api.endpoints.listMyAccessedEntities.matchFulfilled,
      api.endpoints.getSiteSettings.matchFulfilled,
      api.endpoints.listUserProjects.matchFulfilled,
    ]);
    yield put(loadAppFinished());
  } catch (e) {
    console.log({ e });
  }
}

export function* appSaga() {
  yield takeEvery(loadAppStarted, handleLoadAppStarted);
}
