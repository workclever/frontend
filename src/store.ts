import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import { authReducer } from "./slices/auth/authSlice";
import { projectReducer } from "./slices/project/projectSlice";
import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { message } from "antd";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./slices/rootSaga";
import { appReducer } from "./slices/app/appSlice";
import { navigateReducer } from "./slices/navigate/navigateSlice";
import { taskDetailReducer } from "./slices/taskDetail/taskDetailSlice";
import { boardReducer } from "./slices/board/boardSlice";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload.status === 401) {
      //  Ignore 401 Authorization errors, user doesn't need to see them in message
    } else if (action.payload.status === 404) {
      message.error("Error 404, related API endpoint is not found");
    } else if (action.payload.data && action.payload.data.Message) {
      // Do not show to user
      console.error(action.payload.data.Message);
    } else {
      message.error(
        "Unknown error occured in the API. Please try again or reach administrator."
      );
    }
  }

  return next(action);
};

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    project: projectReducer,
    board: boardReducer,
    app: appReducer,
    taskDetail: taskDetailReducer,
    navigate: navigateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(api.middleware, rtkQueryErrorLogger, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
