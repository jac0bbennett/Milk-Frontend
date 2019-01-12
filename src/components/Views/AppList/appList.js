import React, { Component } from "react";
import AppItem from "./appItem";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";

class AppList extends Component {
  constructor(props) {
    super(props);
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Your Apps", "apps");
    this.state = { apps: [], isLoaded: false };
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
      this.setState({ apps, isLoaded: true });
      this.props.session.handleSession(userId, selApp);
      this.props.loadbar.progressTo(100);
    }
  };

  componentDidMount = () => {
    this.getApps();
  };

  NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            sentiment_very_dissatisfied
          </i>
          <br />
          <br />
          You don&#39;t have any apps.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() => this.props.page.handleShowModal("newappform")}
          className="raisedbut"
        >
          <span className="icolab">Create One</span>
          <i style={{ fontSize: "11pt" }} className="material-icons">
            add
          </i>
        </button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <FAB page={this.props.page} modalComp="newappform">
          <i className="material-icons">add</i>
        </FAB>
        {this.state.apps.length > 0 ? (
          this.state.apps.map(app => (
            <AppItem
              key={app.uuid}
              app={app}
              session={this.props.session}
              page={this.props.page}
            />
          ))
        ) : this.state.isLoaded ? (
          <this.NoAppMsg />
        ) : (
          <br />
        )}
      </div>
    );
  }
}

export default AppList;
