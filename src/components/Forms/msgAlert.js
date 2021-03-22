import React from "react";
import usePageStore from "../../stores/usePageStore";

const MsgAlert = props => {
  const modalData = usePageStore(state => state.modalData);
  return (
    <div style={{ width: "100%" }}>
      <h3>{modalData.title}</h3>
      <div className="softtext" style={{ width: "100%" }}>
        {modalData.content}
      </div>
      <br />
      <br />
      <button
        onClick={usePageStore.getState().handleCloseModal}
        className="flatbut"
      >
        {props.buttonname || "Okay"}
      </button>
    </div>
  );
};

export default MsgAlert;
