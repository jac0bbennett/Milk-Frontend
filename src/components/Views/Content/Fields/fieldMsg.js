import React, { useState, useEffect } from "react";

const FieldMsg = props => {
  const [classes, setClasses] = useState(
    props.msg && props.msg.includes("Saved") ? "greentext" : ""
  );

  useEffect(() => {
    setClasses(props.msg && props.msg.includes("Saved") ? "greentext" : "");
  }, [props.msg]);

  return (
    <span style={{ fontSize: "11pt" }} className={classes}>
      {props.msg}
    </span>
  );
};

export default FieldMsg;
