import React, { Component } from "react";
import axios from "axios";
import history from "./history";
import TopBar from "./components/topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./components/loadingBar";
import SignIn from "./components/signIn";
import SignOut from "./components/signOut";
import AppList from "./components/appList";

class App extends Component {
  state = {
    page: { title: "Home", pageId: "" },
    loadBar: { progress: 0, error: false },
    userId: 0,
    appId: 0
  };

  componentWillMount = () => {
    document.title = "Milk | " + this.state.pageTitle;
  };

  handlePageChange = (title, pageId) => {
    document.title = "Milk | " + title;
    const page = { title: title, pageId: pageId };
    this.setState({ page });
  };

  render() {
    return (
      <React.Fragment>
        <LoadingBar
          id="loadingbar"
          progress={this.state.loadBar.progress}
          onErrorDone={this.errorDone}
          onProgressDone={this.progressDone}
          error={this.state.loadBar.error}
        />
        <TopBar page={this.state.page} appId={this.state.appId} />
        <div id="wrapper">
          <Switch>
            <Route
              exact
              path="/panel/apps"
              render={props => (
                <AppList
                  {...props}
                  setLoadBar={this.progressTo}
                  setPage={this.handlePageChange}
                />
              )}
            />
            <Route
              exact
              path="/panel/signin"
              render={props => (
                <SignIn
                  {...props}
                  onSignIn={this.handleSignIn}
                  setLoadBar={this.progressTo}
                  setPage={this.handlePageChange}
                  onError={this.setToError}
                />
              )}
            />
            <Route
              exact
              path="/panel/signout"
              render={props => (
                <SignOut
                  {...props}
                  setLoadBar={this.progressTo}
                  onSignOut={this.handleSignOut}
                  setPage={this.handlePageChange}
                />
              )}
            />
            <Route
              path="*"
              exact={true}
              render={() => (
                <React.Fragment>404 Page Not Found!</React.Fragment>
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }

  handleSignIn = userId => {
    this.setState({ userId });
    history.push("/panel/apps");
  };

  handleSignOut = () => {
    this.progressTo(15);
    axios
      .get(`/api/panel/signout`)
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          console.log(msg);
        } else {
          this.progressTo(100);
          const userId = res.data.signedIn;
          if (userId === 0) {
            history.push("/panel/signout");
          } else {
            history.push("/panel/signin");
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.setToError(true);
      });
    this.setState({ userId: 0 });
    history.push("/panel/signin");
  };

  progressTo = number => {
    const loadBar = { ...this.state.loadBar };
    loadBar.progress = number;
    this.setState({ loadBar });
  };

  setToError = bool => {
    const loadBar = { ...this.state.loadBar };
    loadBar.error = bool;
    this.setState({ loadBar });
  };

  errorDone = () => {
    // Callback
    const loadBar = { ...this.state.loadBar };
    loadBar.error = false;
    this.setState({ loadBar });
  };

  progressDone = () => {
    // Callback
    const loadBar = { ...this.state.loadBar };
    loadBar.progress = 0;
    this.setState({ loadBar });
  };
}

export default App;
