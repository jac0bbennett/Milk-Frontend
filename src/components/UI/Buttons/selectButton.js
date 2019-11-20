import React from "react";

const SelectButton = props => {
  if (!props.sel) {
    return (
      <button
        onClick={() => {
          props.selectItem();
        }}
        className="cmsappselect flatbut"
        style={props.style}
      >
        Select
      </button>
    );
  } else {
    return (
      <button className="cmsappselect flatbut" style={props.style}>
        <span className="bluetext">
          <span className="icolab">Selected</span>
          <i className="material-icons" style={{ fontSize: "12pt" }}>
            check
          </i>
        </span>
      </button>
    );
  }
};

export default SelectButton;
