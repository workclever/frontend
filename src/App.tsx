import React from "react";
import { Routes, Route } from "react-router-dom";
import { BaseLayout } from "./layout/BaseLayout";
import { RequireAuth } from "./layout/RequireAuth";
import { RequireAnonym } from "./layout/RequireAnonym";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/project/ProjectPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { GlobalSettingsPage } from "./pages/manage/GlobalSettingsPage";
import { NotificationsPage } from "./pages/user/NotificationsPage";
import { BoardPage } from "./pages/project/BoardPage";
import { SiteContext } from "./contexts/SiteContext";
import { useInitializeSiteContextValue } from "./hooks/useInitializeSiteContextValue";

const auth = (component: React.ReactElement) => (
  <RequireAuth>{component}</RequireAuth>
);

const anon = (component: React.ReactElement) => (
  <RequireAnonym>{component}</RequireAnonym>
);

export default function App() {
  const value = useInitializeSiteContextValue();
  return (
    <SiteContext.Provider value={value}>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={auth(<HomePage />)} />
          <Route path="/project/:projectId" element={auth(<ProjectPage />)}>
            <Route path="board/:boardId" element={<BoardPage />} />
          </Route>
          <Route
            path="/me/notifications"
            element={auth(<NotificationsPage />)}
          />
          <Route path="/login" element={anon(<LoginPage />)} />
          <Route path="/register" element={anon(<RegisterPage />)} />
          <Route path="/manage" element={auth(<GlobalSettingsPage />)} />
        </Route>
      </Routes>
    </SiteContext.Provider>
  );
}
