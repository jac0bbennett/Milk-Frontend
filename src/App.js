import React, { Component } from "react";
import TopBar from "./components/topBar";
import { Switch, Route } from "react-router-dom";
import LoadingBar from "./components/loadingBar";
import SignIn from "./components/signIn";

class App extends Component {
  state = {
    pageTitle: "Home",
    loadBarWidth: "0%"
  };

  componentWillMount = () => {
    document.title = "Milk " + this.state.pageTitle;
  };

  handleSignIn = () => {
    console.log("sign in");
  };

  handleLoadBarChange = width => {
    this.setState({ loadBarWidth: width });
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
