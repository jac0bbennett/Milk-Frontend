import React from "react";

const TextInput = props => {
  return (
    <div className="geninpdiv">
      <input
        name={props.name}
        className="gentxtinp"
        onChange={props.onChange}
        type={props.type}
        required
      />
      <span className="floating-label">{props.label}</span>
    </div>
  );
};

export default TextInput;
