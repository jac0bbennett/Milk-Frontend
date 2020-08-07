import React, { useState } from "react";

const TextAreaInput = props => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <React.Fragment>
      <h4
        style={{ marginBottom: "5px" }}
        className={isFocused ? "bluetext" : ""}
      >
        {props.label}
      </h4>
      <textarea
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        style={props.style}
        disabled={props.disabled}
        ref={props.setRef}
        onBlur={() => {
          setIsFocused(false);
        }}
        autoFocus={props.autoFocus}
        onFocus={() => {
          setIsFocused(true);
        }}
      />
    </React.Fragment>
  );
};

export default TextAreaInput;
