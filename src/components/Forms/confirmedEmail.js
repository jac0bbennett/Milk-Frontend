import React from "react";

const ConfirmedEmailAlert = props => {
  return (
    <div style={{ width: "100%" }}>
      <h3>Email Confirmed!</h3>
      <div className="softtext" style={{ width: "100%" }}>
        Your account is all setup! Go ahead and Sign In.
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
        Okay
      </button>
    </div>
  );
};

export default ConfirmedEmailAlert;
