import React from "react";

const FAB = props => {
  const style = props.page.state.showModal
    ? {
        transform: "rotate(45deg)"
      }
    : {};

  const handleClick = () => {
    if (props.page.state.showModal) {
      props.page.handleCloseModal();
    } else {
      props.page.handleShowModal(props.modalComp);
    }
  };

  return (
    <button onClick={handleClick} className="fab" style={style}>
      {props.children}
    </button>
  );
};

export default FAB;
