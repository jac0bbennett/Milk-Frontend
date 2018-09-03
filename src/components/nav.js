import React from "react";
import NavLink from "./navLink";

const Nav = props => {
  const selApp = props.selApp;
  const navs = [
    { to: "/panel/apps", label: "apps", navId: "apps", appDep: false },
    {
      to: "/panel/apps/" + selApp,
      label: "content types",
      navId: "types",
      appDep: true
    },
    {
      to: "/panel/apps/" + selApp + "/content",
      label: "content",
      navId: "content",
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

  if (props.userId !== 0) {
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
