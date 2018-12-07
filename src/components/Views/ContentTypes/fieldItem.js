import React from "react";

const FieldItem = props => {
  const field = props.field;
  return (
    <div className={"secondaryitemcont"} key={field.slug}>
      <h4>{field.name}</h4>
      <h5>{field.slug}</h5>
    </div>
  );
};

export default FieldItem;
