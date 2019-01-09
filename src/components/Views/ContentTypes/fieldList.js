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
          field={field}
          page={props.page}
          contentType={props.contentType}
        />
      ))}
    </div>
  );
});

export default FieldList;
