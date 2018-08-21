import React from "react";
import NavLink from "./navLink";

const Nav = props => {
  const appId = props.appId;
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
      to: "/panel/settings",
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
          pageId={props.pageId}
          nav={nav}
          appId={appId}
        />
      ))}
    </ul>
  );
};

export default Nav;
