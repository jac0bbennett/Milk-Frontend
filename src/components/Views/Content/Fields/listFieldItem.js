import React from "react";
import { SortableElement } from "react-sortable-hoc";
import DragHandle from "../../../UI/Misc/dragHandle";

const ListFieldItem = SortableElement(props => (
  <div
    className="coloredbar notInCont"
    style={{ width: "auto", marginRight: "10px", marginTop: "15px" }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <DragHandle cursor="grab" handle="drag_indicator" />
    </div>
    <span>{props.value}</span>
    <button
      className="flatbut darkflatbutton"
      onClick={() => {
        props.deleteValue(props.i);
      }}
      style={{ marginLeft: "10px", marginRight: "5px" }}
    >
      <i className="material-icons" style={{ fontSize: "12pt" }}>
        clear
      </i>
    </button>
  </div>
));

export default ListFieldItem;
