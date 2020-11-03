import React, { useState, useEffect } from "react";
import { deleteRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";

const ConfirmDeleteForm = props => {
  const [msg, setMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMsg("");
  }, [props.page.state.modalData]);

  const handleDelete = async () => {
    props.loadbar.progressTo(15);
    setIsDeleting(true);

    const req = await deleteRequest(props.page.state.modalData.deleteUrl);

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
      setIsDeleting(false);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh();

      if (props.page.state.modalData.callback) {
        props.page.state.modalData.callback();
      }

      setIsDeleting(false);
    }
  };

  return (
    <div className="smallmodal">
      <h3>Are you sure you want to delete this?</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {props.page.state.modalData.extraText}
      </div>
      <br />
      <br />
      <button onClick={props.page.handleCloseModal} className="flatbut">
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
