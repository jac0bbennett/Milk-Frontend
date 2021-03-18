import React from "react";
import FieldOptionValue from "./fieldOptionValue";
import { SortableContainer } from "react-sortable-hoc";

const FieldOptionValues = SortableContainer(props => {
  return (
    <div>
      {props.values.map((value, index) => (
        <FieldOptionValue
          key={index}
          index={index}
          i={index}
          value={value}
          fieldSlug={props.fieldSlug}
          deleteValue={props.deleteValue}
        />
      ))}
    </div>
  );
});

export default FieldOptionValues;
