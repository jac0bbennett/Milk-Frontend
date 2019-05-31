import React, { useState } from "react";
import { postRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";

const ConfirmActionForm = props => {
  const [msg, setMsg] = useState("");
  const [isActing, setIsActing] = useState(false);

  const handleDiscard = async () => {
    props.loadbar.progressTo(15);
    setMsg("discarding...");

    setIsActing(true);

    const req = await postRequest(props.page.state.modalData.discardUrl, {
      action: props.page.state.modalData.action
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
      setIsActing(false);
    } else {
      setMsg("");
      props.page.state.modalData.callback(req.data);
      setIsActing(false);
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h3>{props.page.state.modalData.titleText}</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {props.page.state.modalData.extraText}
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
        Cancel
      </button>
      {!isActing ? (
        <DeleteButton style={{ float: "right" }} onClick={handleDiscard}>
          Confirm
        </DeleteButton>
      ) : null}

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmActionForm;
