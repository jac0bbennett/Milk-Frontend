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
        list={props.list}
        required={props.required}
        disabled={props.disabled}
        ref={props.setRef}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
        onKeyDown={props.onKeyDown}
      />
      <span className="floating-label">{props.label}</span>
    </div>
  );
};

export default TextInput;
