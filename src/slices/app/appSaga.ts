import { put, take, takeEvery } from "redux-saga/effects";
import { loadAppFinished, loadAppStarted, loadRecentProject } from "./appSlice";
import { api } from "../../services/api";
import { RtkQueryOutput } from "../types";
import { ListUserProjectsOutput } from "@app/types/Project";
import { goToProject } from "../navigate/navigateSlice";

const queryConfig = {
  forceRefetch: true,
};

function* handleLoadAppStarted() {
  try {
    yield put(api.endpoints.getSiteSettings.initiate(null, queryConfig));
    yield put(api.endpoints.getUser.initiate(null, queryConfig));
    yield put(api.endpoints.listAllBoards.initiate(null, queryConfig));
    yield put(api.endpoints.listAllUsers.initiate(null, queryConfig));
    yield put(
      api.endpoints.listMyAccessedEntities.initiate(null, {
        forceRefetch: true,
      })
    );
    yield put(api.endpoints.getSiteSettings.initiate(null, queryConfig));
    yield put(api.endpoints.listUserProjects.initiate(null, queryConfig));
    yield take([
      api.endpoints.getSiteSettings.matchFulfilled,
      api.endpoints.getUser.matchFulfilled,
      api.endpoints.listAllBoards.matchFulfilled,
      api.endpoints.listAllUsers.matchFulfilled,
      api.endpoints.listMyAccessedEntities.matchFulfilled,
      api.endpoints.getSiteSettings.matchFulfilled,
      api.endpoints.listUserProjects.matchFulfilled,
    ]);
    yield put(loadAppFinished());
  } catch (e) {
    console.log({ e });
  }
}

function* handleLoadRecentProject() {
  try {
    yield put(api.endpoints.listUserProjects.initiate(null, queryConfig));

    const {
      payload: { Data: projects },
    }: RtkQueryOutput<ListUserProjectsOutput["Data"]> = yield take(
      api.endpoints.listUserProjects.matchFulfilled
    );

    if (projects.length) {
      yield put(goToProject(projects[0].Id));
    }
  } catch (e) {
    console.log({ e });
  }
}

export function* appSaga() {
  yield takeEvery(loadAppStarted, handleLoadAppStarted);
  yield takeEvery(loadRecentProject, handleLoadRecentProject);
}
