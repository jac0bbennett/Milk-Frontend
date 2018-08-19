import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import App from "./App";
import { Router } from "react-router-dom";
import history from "./history";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
