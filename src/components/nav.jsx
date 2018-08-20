import React, { Component } from "react";
import NavLink from "./navLink";

class Nav extends Component {
  render() {
    const appId = this.props.appId;
    const navs = [
      { to: "/panel/apps", label: "apps", navId: "apps", appDep: false },
      {
        to: "/panel/apps/" + appId,
        label: "content types",
        navId: "types",
        appDep: true
      },
      {
        to: "/panel/apps/" + appId + "/content",
        label: "content",
        navId: "content",
        appDep: true
      },
      {
        to: "/panel/apps/settings",
        label: "settings",
        navId: "settings",
        appDep: false
      }
    ];

    return (
      <ul id="nav">
        {navs.map(nav => (
          <NavLink
            key={nav.navId}
            pageId={this.props.pageId}
            nav={nav}
            appId={appId}
          />
        ))}
      </ul>
    );
  }
}

export default Nav;
