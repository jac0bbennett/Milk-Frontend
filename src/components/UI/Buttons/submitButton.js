import React from "react";

const SubmitButton = props => {
  return (
    <button className="raisedbut submitbut floatright" type="submit">
      {props.children}
    </button>
  );
};

export default SubmitButton;
