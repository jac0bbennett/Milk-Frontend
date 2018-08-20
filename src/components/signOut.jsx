import React, { Component } from "react";

class SignOut extends Component {
  componentDidMount = () => {
    this.props.onSignOut();
  };

  render() {
    return <h2>Signing Out...</h2>;
  }
}

export default SignOut;
