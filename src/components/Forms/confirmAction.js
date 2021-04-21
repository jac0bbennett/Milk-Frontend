import React, { useState } from "react";
import { postRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";
import usePageStore from "../../stores/usePageStore";
import useLoadbarStore from "../../stores/useLoadbarStore";

const ConfirmActionForm = () => {
  const [msg, setMsg] = useState("");
  const [isActing, setIsActing] = useState(false);

  const modalData = usePageStore(state => state.modalData);

  const handleAction = async () => {
    if (!isActing) {
      useLoadbarStore.getState().progressTo(15);

      setIsActing(true);

      const req = await postRequest(modalData.url, {
        action: modalData.action
      });

      if (req.error) {
        const reqMsg = req.error;
        setMsg(reqMsg);
        useLoadbarStore.getState().setToError(true);
        setIsActing(false);
      } else {
        setMsg("");
        modalData.callback(req.data);
        setIsActing(false);
        useLoadbarStore.getState().progressTo(100);
        usePageStore.getState().handleCloseModal();
      }
    }
  };

  const handleCancel = () => {
    modalData.callback(null);
    usePageStore.getState().handleCloseModal();
  };

  return (
    <div className="smallmodal">
      <h3>{modalData.titleText}</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {modalData.extraText}
      </div>
      <br />
      <br />
      <button onClick={handleCancel} className="flatbut">
        Cancel
      </button>
      <DeleteButton style={{ float: "right" }} onClick={handleAction}>
        {!isActing ? "Confirm" : modalData.msgText || "submitting..."}
      </DeleteButton>

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmActionForm;
