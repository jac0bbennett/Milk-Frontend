import React from "react";
import EditAppForm from "../../Forms/editApp";
import NewAppForm from "../../Forms/newApp";
import NewApiKeyForm from "../../Forms/newApiKey";
import EditApiKeyForm from "../../Forms/editApiKey";
import NewTypeForm from "../../Forms/newType";
import NewFieldForm from "../../Forms/newField";
import EditFieldForm from "../../Forms/editField";
import NewContentForm from "../../Forms/newContent";
import ConfirmDeleteForm from "../../Forms/confirmDelete";
import ConfirmActionForm from "../../Forms/confirmAction";
import EditFieldOptionValuesForm from "../../Forms/editOptionValues";

const Content = props => {
  switch (props.page.state.modalComp) {
    case "newappform":
      return <NewAppForm {...props} />;
    case "editappform":
      return <EditAppForm {...props} />;
    case "newapikeyform":
      return <NewApiKeyForm {...props} />;
    case "editapikeyform":
      return <EditApiKeyForm {...props} />;
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
    case "confirmactionform":
      return <ConfirmActionForm {...props} />;
    case "editfieldoptionvaluesform":
      return <EditFieldOptionValuesForm {...props} />;
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
