import React, { useState } from "react";
import { postRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";

const ConfirmDiscardDraftForm = props => {
  const [msg, setMsg] = useState("");
  const [isDiscarding, setIsDiscarding] = useState(false);

  const handleDiscard = async () => {
    props.loadbar.progressTo(15);
    setMsg("discarding...");

    setIsDiscarding(true);

    const req = await postRequest(props.page.state.modalData.discardUrl, {
      action: "discardDraft"
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.page.state.modalData.callback(req.data);
      setIsDiscarding(false);
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h3>Are you sure you want to discard this draft?</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {props.page.state.modalData.extraText}
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
        Cancel
      </button>
      {!isDiscarding ? (
        <DeleteButton style={{ float: "right" }} onClick={handleDiscard}>
          Discard
        </DeleteButton>
      ) : null}

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmDiscardDraftForm;
