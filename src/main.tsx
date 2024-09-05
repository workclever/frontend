import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import { Provider } from "react-redux";
// import "@elastic/eui/dist/eui_theme_light.css";
import { EuiProvider } from "@elastic/eui";

// remove while getting rid of @elastic/eui
import "./components/shared/editor/icon-fix";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ConfigProvider } from "antd";

dayjs.extend(timezone);
dayjs.extend(utc);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <EuiProvider colorMode="light">
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#333333",
            colorInfo: "#333333",
            colorSuccess: "#90d66e",
            colorWarning: "#d6930f",
            colorError: "#d22225",
            fontSize: 13,
            sizeStep: 4,
            borderRadius: 6,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  </EuiProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
