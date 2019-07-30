import React from "react";

const TextInput = props => {
  return (
    <div className="geninpdiv" style={props.style}>
      <input
        name={props.name}
        className={!props.wide ? "gentxtinp" : "gentxtinp wide"}
        onChange={props.onChange}
        type={props.type}
        value={props.value}
        autoComplete={props.autoComplete}
        required={props.required}
        disabled={props.disabled}
      />
      <span className="floating-label">{props.label}</span>
    </div>
  );
};

export default TextInput;
