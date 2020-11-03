import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import "./dark.css";
import App from "./App";
import { Router } from "react-router-dom";
import history from "./utils/history";
import "@stripe/stripe-js";
//import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
//registerServiceWorker();
