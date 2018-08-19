import React, { Component } from "react";
import axios from "axios";
import history from "./history";
import TopBar from "./components/topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./components/loadingBar";
import SignIn from "./components/signIn";
import Home from "./components/home";

class App extends Component {
  state = {
    pageTitle: "Home",
    loadBarWidth: "0%",
    userId: 0
  };

  componentWillUnmount = () => {
    console.log("unmount");
  };

  componentWillMount = () => {
    document.title = "Milk " + this.state.pageTitle;
  };

  handleSignIn = userId => {
    this.setState({ userId });
    history.push("/");
  };

  handleLoadBarChange = width => {
    this.setState({ loadBarWidth: width });
  };

  handleTitleChange = () => {};

  handleRequest = url => {
    this.handleLoadBarChange("15%");

    return axios
      .get(`http://localhost:5100/api/` + url, { withCredentials: true })
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          this.setState({ msg });
        } else {
          this.handleLoadBarChange("101%");
          const userId = res.data["signedIn"];
          if (
            userId === 0 ||
            (userId !== this.state.userId && this.state.userId !== 0)
          ) {
            history.push("/signin");
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <LoadingBar width={this.state.loadBarWidth} />
        <TopBar pageTitle={this.state.pageTitle} />
        <div id="wrapper">
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  {...props}
                  setLoadBar={this.handleLoadBarChange}
                  onRequest={this.handleRequest}
                />
              )}
            />
            <Route
              exact
              path="/signin"
              render={props => (
                <SignIn
                  {...props}
                  onSignIn={this.handleSignIn}
                  setLoadBar={this.handleLoadBarChange}
                />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
