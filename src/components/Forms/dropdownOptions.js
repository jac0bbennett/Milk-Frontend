import React from "react";
import DropdownOptionItem from "./dropdownOptionItem";
import { SortableContainer } from "react-sortable-hoc";

const DropdownOptions = SortableContainer(props => {
  return (
    <div>
      {props.values.map((value, index) => (
        <DropdownOptionItem
          key={index}
          index={index}
          i={index}
          value={value}
          page={props.page}
          fieldSlug={props.fieldSlug}
          deleteValue={props.deleteValue}
        />
      ))}
    </div>
  );
});

export default DropdownOptions;
