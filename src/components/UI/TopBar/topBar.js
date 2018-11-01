import React from "react";
import Nav from "./nav";

const TopBar = props => {
  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">{props.page.state.title}</div>
      <Nav pageId={props.page.state.pageId} session={props.session} />
    </div>
  );
};

export default TopBar;
