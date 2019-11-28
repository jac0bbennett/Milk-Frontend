import React, { useState, useEffect } from "react";

const FieldMsg = props => {
  const [classes, setClasses] = useState(props.msg);

  useEffect(() => {
    if (props.msg.includes("Saved")) setClasses("bluetext");
    else if (props.msg === "saving...") setClasses("");
    else setClasses("redtext");
  }, [props.msg]);

  return (
    <span style={{ fontSize: "11pt" }} className={classes}>
      {props.msg.includes("Saved") ? (
        <React.Fragment>
          <i
            className="material-icons"
            style={{ fontSize: "14pt", cursor: "default" }}
            title={props.msg}
          >
            check_circle
          </i>
        </React.Fragment>
      ) : (
        props.msg
      )}
    </span>
  );
};

export default FieldMsg;
