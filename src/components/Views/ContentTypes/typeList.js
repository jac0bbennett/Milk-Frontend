import React, { Component } from "react";
import FAB from "../../UI/Buttons/fab";
import TypeItem from "./typeItem";
import { getRequest } from "../../../utils/requests";

class ContentTypeList extends Component {
  constructor(props) {
    super(props);
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Content Types", "types");
    props.session.handleSession(undefined, this.props.match.params.appuuid);
    this.state = { types: [], isLoaded: false };
  }

  componentWillUpdate = () => {
    if (this.props.page.state.refreshView === true) {
      this.getTypes();
      this.props.page.handleSetRefresh(false);
    }
  };

  getTypes = async (uuid = this.props.session.state.selApp) => {
    const resp = await getRequest("/api/panel/apps/" + uuid + "/types");
    if (resp.error) {
      this.props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const types = resp.data.types;
      const selApp = resp.meta.appUUID;
      this.setState({ types, isLoaded: true });
      this.props.session.handleSession(userId, selApp);
      this.props.loadbar.progressTo(100);
    }
  };

  componentDidMount = () => {
    this.getTypes(this.props.match.params.appuuid);
  };

  NoAppMsg = () => {
    return (
      <center>
        <br />
        <br />
        <br />

        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            sentiment_very_dissatisfied
          </i>
          <br />
          <br />
          You don't have any content types for this app.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() => this.props.page.handleShowModal("newtypeform")}
          className="raisedbut"
        >
          <span className="icolab">Create One</span>
          <i style={{ fontSize: "11pt" }} className="material-icons">
            add
          </i>
        </button>
      </center>
    );
  };

  render() {
    return (
      <div>
        <h3 className="miniheader">{this.props.session.state.selAppName}</h3>
        <FAB page={this.props.page} modalComp="newtypeform">
          <i className="material-icons">add</i>
        </FAB>
        {this.state.types.length > 0 ? (
          this.state.types.map(type => (
            <TypeItem
              key={type.id}
              type={type}
              session={this.props.session}
              page={this.props.page}
              url={
                "/panel/apps/" +
                this.props.session.state.selApp +
                "/types/" +
                type.slug
              }
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

export default ContentTypeList;
