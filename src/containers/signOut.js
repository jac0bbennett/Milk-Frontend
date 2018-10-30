import React, { Component } from "react";

class SignOut extends Component {
  componentDidMount = () => {
    this.props.page.handlePageChange("Signing Out", "signOut");
    this.props.onSignOut();
  };

  render() {
    return <h2>Signing Out...</h2>;
  }
}

export default SignOut;
