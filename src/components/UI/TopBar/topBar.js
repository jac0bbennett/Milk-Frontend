import React from "react";
import Nav from "./nav";
import { Truncate } from "../../../utils/text";
import useSessionStore from "../../../stores/useSessionStore";
import usePageStore from "../../../stores/usePageStore";
import shallow from "zustand/shallow";

const TopBar = props => {
  const { selApp, selAppName, userId } = useSessionStore(
    state => ({
      selApp: state.selApp,
      selAppName: state.selAppName,
      userId: state.userId
    }),
    shallow
  );
  const pageId = usePageStore(state => state.pageId);
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
      to: "/panel/apps/" + selApp + "/assets",
      label: "assets",
      navId: "assets",
      appDep: true
    },
    {
      to: "/panel/account",
      label: "account",
      navId: "account",
      appDep: false
    }
  ];

  const noUserNavs = [
    { to: "/panel/signin", label: "Sign In", navId: "signIn", appDep: false },
    { to: "/panel/signup", label: "Sign Up", navId: "signUp", appDep: false }
  ];

  const shouldShowAppName = () => {
    const navEl = navs.find(i => i.navId === pageId);
    return navEl ? navEl.appDep : true;
  };

  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">
        {shouldShowAppName() ? Truncate(selAppName, 30) : ""}
      </div>
      <Nav
        navs={navs}
        noUserNavs={noUserNavs}
        pageId={pageId}
        selApp={selApp}
        userId={userId}
      />
    </div>
  );
};

export default TopBar;
