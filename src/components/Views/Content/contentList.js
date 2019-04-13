import React, { Component } from "react";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";

class ContentList extends Component {
  constructor(props) {
    super(props);
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Content", "content");
    props.session.handleSession(undefined, this.props.match.params.appuuid);
    this.state = { contents: [], isLoaded: false };
  }

  componentWillUpdate = () => {
    if (this.props.page.state.refreshView === true) {
      this.getContents();
      this.props.page.handleSetRefresh(false);
    }
  };

  getContents = async (uuid = this.props.session.state.selApp) => {
    const resp = await getRequest("/api/panel/apps/" + uuid + "/content");
    if (resp.error) {
      this.props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const contents = resp.data.contents;
      const selApp = resp.meta.appUUID;
      this.setState({ contents, isLoaded: true });
      this.props.session.handleSession(userId, selApp);
      this.props.loadbar.progressTo(100);
    }
  };

  componentDidMount = () => {
    this.getContents(this.props.match.params.appuuid);
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
          You haven&#39;t added any content for this app.
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
      </div>
    );
  };

  render() {
    return (
      <div>
        <MiniHeader header={this.props.session.state.selAppName} />
        <FAB page={this.props.page} modalComp="newtypeform">
          <i className="material-icons">add</i>
        </FAB>
        {this.state.contents.length > 0 ? (
          this.state.contents.map(content => (
            <span key={content.id}>{content.slug}</span>
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

export default ContentList;
