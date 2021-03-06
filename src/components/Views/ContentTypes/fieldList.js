import React from "react";
import FieldItem from "./fieldItem";
import { SortableContainer } from "react-sortable-hoc";

const FieldList = SortableContainer(props => {
  return (
    <div>
      {props.fields.map((field, index) => (
        <FieldItem
          key={field.slug}
          index={index}
          i={index}
          field={field}
          typeSlug={props.typeSlug}
        />
      ))}
    </div>
  );
});

export default FieldList;
