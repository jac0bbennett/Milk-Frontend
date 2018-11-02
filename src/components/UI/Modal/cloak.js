import React from "react";

const Cloak = props => {
  const showStyle = {
    opacity: 0.5,
    visibility: "visible"
  };
  const style = props.isShow ? showStyle : {};
  return (
    <div id="divcloak" style={style} onClick={props.page.handleCloseModal} />
  );
};

export default Cloak;
