import React from "react";
import Nav from "./nav";

const TopBar = ({ page }) => {
  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">{page.title}</div>
      <Nav pageId={page.pageId} />
    </div>
  );
};

export default TopBar;
