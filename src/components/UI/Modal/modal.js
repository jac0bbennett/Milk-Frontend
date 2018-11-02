import React from "react";
import EditAppForm from "../../Forms/editApp";
import NewAppForm from "../../Forms/newApp";

const Content = props => {
  switch (props.page.state.modalComp) {
    case "newappform":
      return <NewAppForm {...props} />;
    case "editappform":
      return <EditAppForm {...props} />;
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
