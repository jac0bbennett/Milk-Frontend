import React, { Component } from "react";

class LoadingBar extends Component {
  getWidth() {
    return { width: this.props.width };
  }

  render() {
    return <div id="loadingbar" style={this.getWidth()} />;
  }
}

export default LoadingBar;
