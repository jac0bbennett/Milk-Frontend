import React from "react";
import ListFieldItem from "./listFieldItem";
import { SortableContainer } from "react-sortable-hoc";

const ListFieldList = SortableContainer(props => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {props.values.map((value, index) => (
        <ListFieldItem
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

export default ListFieldList;
