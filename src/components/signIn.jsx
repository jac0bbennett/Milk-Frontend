import React, { Component } from "react";

class SignIn extends Component {
  state = {};
  render() {
    return (
      <div id="signin">
        <h1>Sign In</h1>
        <div className="geninpdiv">
          <input className="gentxtinp" type="text" required />
          <span className="floating-label">Pseudonym</span>
        </div>
        <div className="geninpdiv">
          <input className="gentxtinp" type="password" required />
          <span className="floating-label">Key</span>
        </div>
        <span id="msg" />
        <button className="raisedbut submitbut">Sign In</button>
        <br />
        <br />
      </div>
    );
  }
}

export default SignIn;
