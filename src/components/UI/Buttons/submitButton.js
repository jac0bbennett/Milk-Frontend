import React from "react";

const SubmitButton = props => {
  return (
    <button
      className="raisedbut submitbut floatright"
      style={props.style}
      disabled={props.disabled}
      type="submit"
    >
      {props.children}
    </button>
  );
};

export default SubmitButton;
