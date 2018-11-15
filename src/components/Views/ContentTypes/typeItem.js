import React from "react";
import { Link } from "react-router-dom";

const TypeItem = props => {
  return (
    <div className={"typeitem"}>
      <Link to={props.url}>
        <button
          className="flatbut"
          style={{
            float: "right",
            padding: "5px"
          }}
        >
          <i className="material-icons">create</i>
        </button>
      </Link>
      <h2>{props.type.name}</h2>
      <h3 className="softtext">{props.type.slug}</h3>
    </div>
  );
};

export default TypeItem;
