import React from "react";
import Nav from "./nav";

const TopBar = props => {
  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">{props.page.title}</div>
      <Nav
        pageId={props.page.pageId}
        userId={props.userId}
        selApp={props.selApp}
      />
    </div>
  );
};

export default TopBar;
