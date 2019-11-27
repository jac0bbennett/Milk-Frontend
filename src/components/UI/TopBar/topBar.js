import React from "react";
import Nav from "./nav";
import { Truncate } from "../../../utils/text";

const TopBar = props => {
  const selApp = props.session.state.selApp;
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
    { to: "/panel/signin", label: "Sign In", navId: "signIn", appDep: false },
    { to: "/panel/signup", label: "Sign Up", navId: "signUp", appDep: false }
  ];

  const shouldShowAppName = pageId => {
    const navEl = navs.find(i => i.navId === pageId);
    return navEl ? navEl.appDep : true;
  };

  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">
        {shouldShowAppName(props.page.state.pageId)
          ? Truncate(props.session.state.selAppName, 30)
          : ""}
      </div>
      <Nav
        navs={navs}
        noUserNavs={noUserNavs}
        pageId={props.page.state.pageId}
        session={props.session}
      />
    </div>
  );
};

export default TopBar;
