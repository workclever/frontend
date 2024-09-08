import React, { useEffect } from "react";
import {
  Routes,
  Route,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { BaseLayout } from "./layout/BaseLayout";
import { RequireAuth } from "./layout/RequireAuth";
import { RequireAnonym } from "./layout/RequireAnonym";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { GlobalSettingsPage } from "./pages/manage/GlobalSettingsPage";
import { BoardPage } from "./pages/project/BoardPage";
import { LoadingSpin } from "./components/shared/primitives/LoadingSpin";
import { history } from "./history";
import { useDispatch, useSelector } from "react-redux";
import { loadAppStarted, selectAppLoading } from "./slices/app/appSlice";
import { TaskDetailPage } from "./pages/project/components/board/task-detail/TaskDetailPage";
import { CommandMenu } from "./components/shared/cmdk/CommandMenu";
import { ProjectPage } from "./pages/project/ProjectPage";

const auth = (component: React.ReactElement) => (
  <RequireAuth>{component}</RequireAuth>
);

const anon = (component: React.ReactElement) => (
  <RequireAnonym>{component}</RequireAnonym>
);

export default function App() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAppLoading);

  useEffect(() => {
    dispatch(loadAppStarted());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={auth(<HomePage />)} />
          <Route path="/project/:projectId" element={auth(<ProjectPage />)}>
            <Route path="board/:boardId" element={<BoardPage />}>
              <Route path="task/:taskId" element={<TaskDetailPage />} />
            </Route>
          </Route>
          <Route path="/login" element={anon(<LoginPage />)} />
          <Route path="/register" element={anon(<RegisterPage />)} />
          <Route path="/manage" element={auth(<GlobalSettingsPage />)} />
        </Route>
      </Routes>
      <CommandMenu />
    </HistoryRouter>
  );
}
