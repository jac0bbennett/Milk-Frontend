import React, { Component } from "react";
import AppItem from "./appItem";
import { getRequest } from "../../../utils/requests";

class AppList extends Component {
  constructor(props) {
    super(props);
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Your Apps", "apps");
    this.state = { apps: [] };
  }

  componentWillUpdate = () => {
    if (this.props.page.state.refreshView === true) {
      this.getApps();
      this.props.page.handleSetRefresh(false);
    }
  };

  getApps = async () => {
    const resp = await getRequest("/api/panel/apps");
    if (resp.error) {
      this.props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const apps = resp.data.apps;
      const selApp = resp.meta.appUUID;
      this.setState({ apps, selApp });
      this.props.session.handleSession(userId, selApp);
      this.props.loadbar.progressTo(100);
    }
  };

  componentDidMount = () => {
    this.getApps();
  };

  render() {
    return (
      <React.Fragment>
        {this.state.apps.map(app => (
          <AppItem
            key={app.uuid}
            app={app}
            session={this.props.session}
            page={this.props.page}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default AppList;
