import React, { Component } from "react";
import TopBar from "./components/topBar";
import { Switch, Route } from "react-router-dom";
import SignIn from "./components/signIn";

class App extends Component {
  state = {
    pageTitle: "Home"
  };

  componentWillMount = () => {
    document.title = "Milk " + this.state.pageTitle;
  };

  handleSignIn = () => {
    console.log("sign in");
  };

  render() {
    return (
      <React.Fragment>
        <div id="loadingbar" />
        <TopBar pageTitle={this.state.pageTitle} />
        <div id="wrapper">
          <Switch>
            <Route
              exact
              path="/signin"
              render={props => (
                <SignIn {...props} onSignIn={this.handleSignIn} />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
