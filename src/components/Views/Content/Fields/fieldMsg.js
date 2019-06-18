import React, { useState, useEffect } from "react";

const FieldMsg = props => {
  const [classes, setClasses] = useState(props.msg);

  useEffect(() => {
    if (props.msg.includes("Saved")) setClasses("greentext");
    else if (props.msg === "saving...") setClasses("");
    else setClasses("redtext");
  }, [props.msg]);

  return (
    <span style={{ fontSize: "11pt" }} className={classes}>
      {props.msg}
    </span>
  );
};

export default FieldMsg;
