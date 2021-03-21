import React from "react";
import shallow from "zustand/shallow";
import usePageStore from "../../../stores/usePageStore";

const Cloak = () => {
  const [isShow, handleCloseModal] = usePageStore(
    state => [state.showModal, state.handleCloseModal],
    shallow
  );
  const showStyle = {
    opacity: 0.75,
    visibility: "visible"
  };
  const style = isShow ? showStyle : {};

  return <div id="divcloak" style={style} onClick={handleCloseModal} />;
};

export default Cloak;
