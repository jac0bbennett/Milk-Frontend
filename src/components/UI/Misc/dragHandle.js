import React from "react";
import { SortableHandle } from "react-sortable-hoc";

const DragHandle = SortableHandle(props => (
  <div
    style={{
      paddingRight: "15px",
      fontSize: "18pt",
      cursor: props.cursor || "row-resize",
      marginLeft: "15px",
      marginRight: "5px"
    }}
    className="material-icons"
  >
    {props.handle || "drag_handle"}
  </div>
));

export default DragHandle;
