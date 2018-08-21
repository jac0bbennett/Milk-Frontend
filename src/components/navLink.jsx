import React from "react";
import { Link } from "react-router-dom";

const NavLink = props => {
  const getClassNames = navId => {
    const pageId = props.pageId;
    return pageId !== navId ? "navbut" : "navbut currenttab";
  };

  const rejectClick = () => {
    alert("Please select an app first!");
  };

  const appId = props.appId;
  if (appId !== 0 || props.nav.appDep === false) {
    return (
      <Link to={props.nav.to}>
        <li className={getClassNames(props.nav.navId)}>{props.nav.label}</li>
      </Link>
    );
  } else {
    return (
      <li onClick={rejectClick} className={getClassNames(props.nav.navId)}>
        {props.nav.label}
      </li>
    );
  }
};

export default NavLink;
