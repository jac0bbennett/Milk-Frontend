import React, { useState } from "react";
import { postRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";

const ConfirmActionForm = props => {
  const [msg, setMsg] = useState("");
  const [isActing, setIsActing] = useState(false);

  const handleAction = async () => {
    props.loadbar.progressTo(15);
    setMsg(props.page.state.modalData.msgText || "submitting...");

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

  const handleCancel = () => {
    props.page.state.modalData.callback(null);
    props.page.handleCloseModal();
  };

  return (
    <div className="smallmodal">
      <h3>{props.page.state.modalData.titleText}</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {props.page.state.modalData.extraText}
      </div>
      <br />
      <br />
      <button onClick={handleCancel} className="flatbut">
        Cancel
      </button>
      {!isActing ? (
        <DeleteButton style={{ float: "right" }} onClick={handleAction}>
          Confirm
        </DeleteButton>
      ) : null}

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmActionForm;
