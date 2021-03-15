import React, { useState, useEffect } from "react";
import { deleteRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";
import usePageStore from "../../stores/usePageStore";
import useLoadbarStore from "../../stores/useLoadbarStore";

const ConfirmDeleteForm = () => {
  const [msg, setMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const modalData = usePageStore(state => state.modalData);

  useEffect(() => {
    setMsg("");
  }, [modalData]);

  const handleDelete = async () => {
    useLoadbarStore.getState().progressTo(15);
    setIsDeleting(true);

    const req = await deleteRequest(modalData.deleteUrl);

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
      setIsDeleting(false);
    } else {
      setMsg("");
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();

      if (modalData.callback) {
        modalData.callback();
      }

      setIsDeleting(false);
    }
  };

  return (
    <div className="smallmodal">
      <h3>Are you sure you want to delete this?</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {modalData.extraText}
      </div>
      <br />
      <br />
      <button
        onClick={usePageStore.getState().handleCloseModal}
        className="flatbut"
      >
        Cancel
      </button>
      <DeleteButton
        style={{ float: "right" }}
        onClick={handleDelete}
        disabled={isDeleting ? true : false}
      >
        {!isDeleting ? "Confirm" : "Deleting..."}
      </DeleteButton>

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmDeleteForm;
