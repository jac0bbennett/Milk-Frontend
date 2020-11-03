import React from "react";

const DeleteButton = props => {
  return (
    <button
      onClick={props.onClick}
      style={props.style}
      className="flatbut redtext"
      type="button"
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default DeleteButton;
