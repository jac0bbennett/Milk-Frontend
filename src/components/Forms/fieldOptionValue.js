import React from "react";
import { SortableElement } from "react-sortable-hoc";
import DragHandle from "../UI/Misc/dragHandle";

const FieldOptionValue = SortableElement(props => (
  <div className="coloredbar notInCont">
    <div style={{ display: "flex", alignItems: "center" }}>
      <DragHandle />
    </div>
    <span>{props.value}</span>
    <button
      className="flatbut darkflatbutton"
      onClick={() => {
        props.deleteValue(props.i);
      }}
      style={{ marginLeft: "auto", marginRight: "5px" }}
    >
      <i className="material-icons" style={{ fontSize: "12pt" }}>
        clear
      </i>
    </button>
  </div>
));

export default FieldOptionValue;
