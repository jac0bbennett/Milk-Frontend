import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavLink extends Component {
  getClassNames = navId => {
    const pageId = this.props.pageId;
    return pageId !== navId ? "navbut" : "navbut currenttab";
  };

  rejectClick = () => {
    alert("Please select an app first!");
  };

  render() {
    const appId = this.props.appId;
    if (appId !== 0 && this.props.nav.appDep === false) {
      return (
        <Link to={this.props.nav.to}>
          <li className={this.getClassNames(this.props.nav.navId)}>
            {this.props.nav.label}
          </li>
        </Link>
      );
    } else {
      return (
        <li
          onClick={this.rejectClick}
          className={this.getClassNames(this.props.nav.navId)}
        >
          {this.props.nav.label}
        </li>
      );
    }
  }
}

export default NavLink;
