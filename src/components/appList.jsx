import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import AppItem from "./appItem";

class AppList extends Component {
  constructor(props) {
    super(props);
    props.setLoadBar(15);
    props.setPage("Your Apps", "apps");
    this.state = { apps: [], selApp: "0" };
  }

  componentDidMount = () => {
    axios
      .get(`/api/panel/apps`)
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          console.log(msg);
        } else {
          this.props.setLoadBar(100);
          const userId = res.data.signedIn;
          if (userId === 0) {
            history.push("/panel/signout");
          } else {
            const apps = res.data.apps;
            const selApp = res.data.selApp;
            this.handleSession(userId, selApp, apps);
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.props.onError(true);
      });
  };

  handleSession = (userId, selApp, apps = this.state.apps) => {
    console.log(userId);
    console.log(selApp);
    this.setState({ apps, selApp });
    this.props.onSession(userId, selApp);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.apps.map(app => (
          <AppItem
            key={app.uuid}
            app={app}
            selApp={this.state.selApp}
            onSelectApp={this.handleSession}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default AppList;
