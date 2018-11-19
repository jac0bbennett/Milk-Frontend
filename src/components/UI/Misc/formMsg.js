import React from "react";

const FormMsg = props => {
  return (
    <span className="msg" style={props.style}>
      {props.msg}
    </span>
  );
};

export default FormMsg;
