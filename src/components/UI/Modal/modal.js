import React from "react";
import EditAppForm from "../../Forms/editApp";
import NewAppForm from "../../Forms/newApp";
import NewTypeForm from "../../Forms/newType";
import NewFieldForm from "../../Forms/newField";
import EditFieldForm from "../../Forms/editField";
import NewContentForm from "../../Forms/newContent";
import ConfirmDeleteForm from "../../Forms/confirmDelete";
import ConfirmDiscardDraftForm from "../../Forms/confirmDiscardDraft";

const Content = props => {
  switch (props.page.state.modalComp) {
    case "newappform":
      return <NewAppForm {...props} />;
    case "editappform":
      return <EditAppForm {...props} />;
    case "newtypeform":
      return <NewTypeForm {...props} />;
    case "newfieldform":
      return <NewFieldForm {...props} />;
    case "editfieldform":
      return <EditFieldForm {...props} />;
    case "newcontentform":
      return <NewContentForm {...props} />;
    case "confirmdeleteform":
      return <ConfirmDeleteForm {...props} />;
    case "confirmdiscarddraftform":
      return <ConfirmDiscardDraftForm {...props} />;
    default:
      return <h2>Form</h2>;
  }
};

const Modal = props => {
  const showStyle = {
    opacity: 100,
    top: "50px"
  };
  const style = props.isShow ? showStyle : {};

  return (
    <div id="modal" style={style}>
      <i
        onClick={props.page.handleCloseModal}
        id="hidformexit"
        className="material-icons"
      >
        clear
      </i>
      <br />
      <Content
        loadbar={props.loadbar}
        session={props.session}
        page={props.page}
      />
    </div>
  );
};

export { Modal, Content };
