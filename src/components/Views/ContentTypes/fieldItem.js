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
    case "number_int":
      return "Integer";
    case "number_float":
      return "Decimal";
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
    case "number_int":
      return "exposure_plus_1";
    case "number_float":
      return "filter_5";
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
      <span className="icolab">
        <span>{props.field.name}</span>
      </span>
      <button
        className="flatbut darkflatbutton"
        onClick={() => {
          props.page.handleShowModal("editfieldform", {
            field: props.field,
            index: props.i,
            typeSlug: props.typeSlug
          });
        }}
      >
        <i className="material-icons">more_horiz</i>
      </button>
    </div>
    <div className="fieldattr" style={{ marginTop: "10px" }}>
      <span>{decodeFieldType(props.field.fieldType)}</span>
      <span className="softtext">{props.field.slug}</span>
    </div>
  </div>
));

export default FieldItem;
export { getIcon };
