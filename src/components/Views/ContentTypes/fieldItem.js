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

const FieldItem = SortableElement(props => (
  <div className="secondaryitemcont">
    <div className="coloredbar">
      <DragHandle />
      <i
        style={{ paddingRight: "15px", fontSize: "18pt" }}
        className="material-icons"
      >
        {getIcon(props.field.fieldType)}
      </i>
      <span className="icolab">{decodeFieldType(props.field.fieldType)}</span>
      <button
        className="flatbut cmsappmanage"
        style={{
          float: "right",
          padding: "5px",
          marginTop: "-5px",
          background: "inherit",
          color: "#fff"
        }}
        onClick={() => {
          props.page.handleShowModal("editfieldform", {
            field: props.field,
            contentType: props.contentType
          });
        }}
      >
        <i className="material-icons">more_horiz</i>
      </button>
    </div>
    <span>{props.field.name}</span>
    <span>{props.field.slug}</span>
  </div>
));

export default FieldItem;
