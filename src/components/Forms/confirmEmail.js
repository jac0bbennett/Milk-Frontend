import React from "react";

const ConfirmEmailAlert = props => {
  return (
    <div style={{ width: "100%" }}>
      <h3>Email Confirmation Sent</h3>
      <div className="softtext" style={{ width: "100%" }}>
        An email has been sent to {props.page.state.modalData.email}. Please
        confirm it to finish setting up your account.
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
        Okay
      </button>
    </div>
  );
};

export default ConfirmEmailAlert;
