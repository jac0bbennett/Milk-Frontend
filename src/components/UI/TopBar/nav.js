import React from "react";
import NavLink from "./navLink";

const Nav = props => {
  const selApp = props.session.state.selApp;
  const userId = props.session.state.userId;
  const navs = [
    { to: "/panel/apps", label: "apps", navId: "apps", appDep: false },
    {
      to: "/panel/apps/" + selApp + "/types",
      label: "content types",
      navId: "types",
      appDep: true
    },
    {
      to: "/panel/apps/" + selApp + "/content",
      label: "content",
      navId: "contents",
      appDep: true
    },
    {
      to: "/panel/settings",
      label: "settings",
      navId: "settings",
      appDep: false
    }
  ];

  const noUserNavs = [
    { to: "/panel/signin", label: "Sign In", navId: "signIn", appDep: false }
  ];

  if (userId !== 0) {
    return (
      <ul id="nav">
        {navs.map(nav => (
          <NavLink
            key={nav.navId}
            pageId={props.pageId}
            nav={nav}
            selApp={selApp}
          />
        ))}
      </ul>
    );
  } else {
    return (
      <ul id="nav">
        {noUserNavs.map(nav => (
          <NavLink
            key={nav.navId}
            pageId={props.pageId}
            nav={nav}
            selApp={selApp}
          />
        ))}
      </ul>
    );
  }
};

export default Nav;
