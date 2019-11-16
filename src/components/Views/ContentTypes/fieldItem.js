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
    <div className="coloredbar" style={{ height: "25px" }}>
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
