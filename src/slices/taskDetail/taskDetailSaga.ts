import { put, take, takeEvery } from "redux-saga/effects";
import {
  loadTaskDetailFinished,
  loadTaskDetailStarted,
} from "./taskDetailSlice";
import { api } from "../../services/api";
import { RtkQueryOutput } from "../types";
import { TaskType } from "@app/types/Project";
import {
  setSelectedBoardId,
  setSelectedProjectId,
  setSelectedTaskId,
} from "../project/projectSlice";

const queryConfig = {
  forceRefetch: true,
};

function* handleLoadTaskDetailStarted({
  payload,
}: ReturnType<typeof loadTaskDetailStarted>) {
  try {
    yield put(api.endpoints.getTask.initiate(payload.taskId, queryConfig));

    const data: RtkQueryOutput<TaskType> = yield take(
      api.endpoints.getTask.matchFulfilled
    );

    if (data.payload.Data.Id) {
      yield put(setSelectedTaskId(data.payload.Data.Id));
    }

    if (data.payload.Data.ProjectId) {
      yield put(setSelectedProjectId(data.payload.Data.ProjectId));
    }

    if (data.payload.Data.BoardId) {
      yield put(setSelectedBoardId(data.payload.Data.BoardId));
    }

    yield put(loadTaskDetailFinished());
  } catch (e) {
    console.log({ e });
  }
}

export function* taskDetailSaga() {
  yield takeEvery(loadTaskDetailStarted, handleLoadTaskDetailStarted);
}
