import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import { Provider } from "react-redux";
// import "@elastic/eui/dist/eui_theme_light.css";
import { EuiProvider } from "@elastic/eui";

// TODO remove while getting rid of @elastic/eui
import "./components/shared/editor/icon-fix";
import "@atlaskit/css-reset";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <EuiProvider colorMode="light">
    <Provider store={store}>
      <App />
    </Provider>
  </EuiProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
