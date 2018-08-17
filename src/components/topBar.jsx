import React from "react";

const TopBar = ({ pageTitle }) => {
  return (
    <div id="top">
      <div id="top-branding">MILK</div>
      <div id="pagetitle">{pageTitle}</div>
    </div>
  );
};

export default TopBar;
