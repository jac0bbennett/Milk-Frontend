import React from "react";

const FormMsg = props => {
  const baseClassnames = "msg";
  const classnames =
    props.color == "red"
      ? baseClassnames + " redtext"
      : baseClassnames + " softtext";
  return (
    <span className={classnames} style={props.style}>
      {props.msg}
    </span>
  );
};

export default FormMsg;
