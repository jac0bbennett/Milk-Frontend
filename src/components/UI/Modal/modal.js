import React from "react";
import EditAppForm from "../../Forms/editApp";

const Content = props => {
  switch (props.page.state.modalComp) {
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
  const style = () => {
    return props.isShow ? showStyle : {};
  };

  return (
    <div id="modal" style={style()}>
      <Content loadbar={props.loadbar} page={props.page} />
    </div>
  );
};

export { Modal, Content };
