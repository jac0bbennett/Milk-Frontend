import React from "react";
import NavLink from "./navLink";

const Nav = props => {
  const selApp = props.session.state.selApp;
  const userId = props.session.state.userId;

  const navs = props.navs;
  const noUserNavs = props.noUserNavs;

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
