import React from "react";

const DropDownInput = props => {
  return (
    <div className="geninpdiv" style={props.style}>
      <select
        name={props.name}
        className="gendropinp"
        onChange={props.onChange}
        value={props.value}
        autoComplete={props.autoComplete}
        required={props.required}
        disabled={props.disabled}
        style={props.style}
      >
        <option disabled hidden style={{ display: "none" }} value="" />
        {props.children}
      </select>
      <span className="floating-label">{props.label}</span>
    </div>
  );
};

export default DropDownInput;
