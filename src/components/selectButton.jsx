import React from "react";

const SelectButton = props => {
  if (!props.sel) {
    return (
      <button
        onClick={() => {
          props.selectItem();
        }}
        className="cmsappselect flatbut"
        style={{ float: "right" }}
      >
        Select
      </button>
    );
  } else {
    return (
      <button className="cmsappselect flatbut" style={{ float: "right" }}>
        <span style={{ color: "#3C81C8" }}>
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
