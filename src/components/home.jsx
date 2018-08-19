import React, { Component } from "react";

class Home extends Component {
  componentWillMount = () => {
    this.props.onRequest("panel/apps");
  };

  render() {
    return <h1>Home</h1>;
  }
}

export default Home;
