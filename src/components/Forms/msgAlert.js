import React from "react";

const MsgAlert = props => {
  return (
    <div style={{ width: "100%" }}>
      <h3>{props.page.state.modalData.title}</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {props.page.state.modalData.content}
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
        {props.buttonname || "Okay"}
      </button>
    </div>
  );
};

export default MsgAlert;
