import React from "react";
import FieldItem from "./fieldItem";
import { SortableContainer } from "react-sortable-hoc";

const FieldList = SortableContainer(({ fields }) => {
  return (
    <div>
      {fields.map((field, index) => (
        <FieldItem key={field.slug} index={index} field={field} />
      ))}
    </div>
  );
});

export default FieldList;
