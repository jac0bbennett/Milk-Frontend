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

  render() {
    return (
      <React.Fragment>
        <div id="loadingbar" />
        <TopBar pageTitle={this.state.pageTitle} />
        <div id="wrapper">
          <Switch>
            <Route exact path="/signin" component={SignIn} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
