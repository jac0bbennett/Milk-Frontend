import React from "react";
import { SortableElement } from "react-sortable-hoc";
import DragHandle from "../../UI/Misc/dragHandle";

const decodeFieldType = fieldtype => {
  switch (fieldtype) {
    case "text_short":
      return "Short Text";
    case "text_long":
      return "Long Text";
    case "dropdown":
      return "Dropdown";
    case "list":
      return "List";
    case "number_int":
      return "Integer";
    case "number_float":
      return "Decimal";
    case "boolean":
      return "Boolean";
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
    case "dropdown":
      return "menu_open";
    case "list":
      return "list";
    case "number_int":
      return "exposure_plus_1";
    case "number_float":
      return "filter_5";
    case "boolean":
      return "hdr_strong";
    default:
      return "text_fields";
  }
};

const FieldItem = SortableElement(props => (
  <div
    className="secondaryitemcont"
    style={{
      flexDirection: "column",
      padding: "0px",
      paddingBottom: "15px"
    }}
  >
    <div className="coloredbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <DragHandle />
      </div>
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
        style={{ marginLeft: "auto", marginRight: "5px" }}
      >
        <i className="material-icons">more_horiz</i>
      </button>
    </div>
    <div className="fieldattr" style={{ marginTop: "10px" }}>
      <div
        style={{
          marginLeft: "-37px",
          marginRight: "30px",
          fontWeight: "bold",
          width: "10px",
          display: "inline-block",
          cursor: "default"
        }}
        title="Content Title"
      >
        {props.field.options && props.field.options["title"] ? "T" : null}
      </div>
      <span>{decodeFieldType(props.field.fieldType)}</span>
      <span className="softtext">{props.field.slug}</span>
    </div>
  </div>
));

export default FieldItem;
export { getIcon };
