import React from "react";
import usePageStore from "../../../stores/usePageStore";

const FAB = props => {
  const showModal = usePageStore(state => state.showModal);
  const style = showModal
    ? {
        transform: "rotate(45deg)"
      }
    : {};

  const handleClick = () => {
    if (showModal) {
      usePageStore.getState().handleCloseModal();
    } else {
      usePageStore
        .getState()
        .handleShowModal(props.modalComp, props.modalData, props.reset);
    }
  };

  return (
    <button onClick={handleClick} className="fab" style={style}>
      {props.children}
    </button>
  );
};

export default FAB;
