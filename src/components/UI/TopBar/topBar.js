import React from "react";
import Nav from "./nav";
import { Truncate } from "../../../utils/text";

const TopBar = props => {
  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">{Truncate(props.page.state.title, 20)}</div>
      <Nav pageId={props.page.state.pageId} session={props.session} />
    </div>
  );
};

export default TopBar;
