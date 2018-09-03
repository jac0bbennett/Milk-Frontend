import React, { Component } from "react";
import AppItem from "./appItem";
import { getRequest } from "../utils/requests";

class AppList extends Component {
  constructor(props) {
    super(props);
    props.setLoadBar(15);
    props.setPage("Your Apps", "apps");
    this.state = { apps: [], selApp: props.selApp };
  }

  getApps = async () => {
    const resp = await getRequest("/api/panel/apps");
    if (resp.error) {
      this.props.onError(true);
    } else {
      const userId = resp.meta.userId;
      const apps = resp.data.apps;
      const selApp = resp.meta.appUUID;
      this.setState({ apps, selApp });
      this.props.onSession(userId, selApp);
      this.props.setLoadBar(100);
    }
  };

  componentDidMount = () => {
    this.getApps();
  };

  handleSelectApp = async uuid => {
    this.props.onSession(undefined, uuid);
    const resp = await getRequest("/api/panel/apps/select/" + uuid);

    if (resp.error) {
      this.props.onError(true);
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.apps.map(app => (
          <AppItem
            key={app.uuid}
            app={app}
            selApp={this.props.selApp}
            onSelectApp={this.handleSelectApp}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default AppList;
