import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import App from "./components/App";
import { Router } from "react-router-dom";
import history from "./utils/history";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
