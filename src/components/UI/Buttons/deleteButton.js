import React from "react";

const DeleteButton = props => {
  return (
    <button onClick={props.onClick} className="flatbut redtext" type="button">
      {props.children}
    </button>
  );
};

export default DeleteButton;
