import React from "react";
import { SortableElement, SortableHandle } from "react-sortable-hoc";

const DragHandle = SortableHandle(() => (
  <div
    style={{
      paddingRight: "15px",
      fontSize: "18pt",
      cursor: "row-resize",
      borderRight: "1px solid #fff",
      marginRight: "15px"
    }}
    className="material-icons"
  >
    drag_handle
  </div>
));

const decodeFieldType = fieldtype => {
  switch (fieldtype) {
    case "text_short":
      return "Short Text";
    case "text_long":
      return "Long Text";
    default:
      return "Field";
  }
};

const getIcon = fieldtype => {
  switch (fieldtype) {
    case "text_short":
      return "text_fields";
    case "text_long":
      return "format_align_left";
    default:
      return "text_fields";
  }
};

const FieldItem = SortableElement(({ field }) => (
  <div className="secondaryitemcont">
    <div className="coloredbar">
      <DragHandle />
      <i
        style={{ paddingRight: "15px", fontSize: "18pt" }}
        className="material-icons"
      >
        {getIcon(field.fieldType)}
      </i>
      <span className="icolab">{decodeFieldType(field.fieldType)}</span>
    </div>
    <span>{field.name}</span>
    <span>{field.slug}</span>
  </div>
));

export default FieldItem;
