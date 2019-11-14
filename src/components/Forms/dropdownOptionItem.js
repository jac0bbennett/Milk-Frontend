import React from "react";
import { SortableElement } from "react-sortable-hoc";
import DragHandle from "../UI/Misc/dragHandle";

const DropdownOptionItem = SortableElement(props => (
  <div className="coloredbar notInCont">
    <DragHandle />
    <span>{props.value}</span>
    <button
      className="flatbut darkflatbutton"
      onClick={() => {
        props.deleteValue(props.i);
      }}
    >
      <i className="material-icons" style={{ fontSize: "12pt" }}>
        clear
      </i>
    </button>
  </div>
));

export default DropdownOptionItem;
