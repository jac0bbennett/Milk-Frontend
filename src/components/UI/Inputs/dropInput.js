import React from "react";

const DropDownInput = props => {
  return (
    <div className="geninpdiv">
      <select
        name={props.name}
        className="gendropinp"
        onChange={props.onChange}
        value={props.value}
        autoComplete={props.autoComplete}
        required={props.required}
        disabled={props.disabled}
      >
        <option disabled hidden style={{ display: "none" }} value="" />
        <option value="text_short">Short Text</option>
        <option value="text_long">Long Text</option>
      </select>
      <span className="floating-label">{props.label}</span>
    </div>
  );
};

export default DropDownInput;
