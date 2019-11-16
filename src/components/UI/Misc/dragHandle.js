import React from "react";
import { SortableHandle } from "react-sortable-hoc";

const DragHandle = SortableHandle(() => (
  <div
    style={{
      paddingRight: "15px",
      fontSize: "18pt",
      cursor: "row-resize",
      borderRight: "1px solid #fff",
      marginLeft: "15px",
      marginRight: "15px"
    }}
    className="material-icons"
  >
    drag_handle
  </div>
));

export default DragHandle;
