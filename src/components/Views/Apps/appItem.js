import React from "react";
import SelectButton from "../../UI/Buttons/selectButton";
import usePageStore from "../../../stores/usePageStore";

const AppItem = props => {
  return (
    <div className={getClassNames(props.app.uuid, props.session.state.selApp)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around"
        }}
      >
        <h2 style={{ margin: "0px" }}>{props.app.name}</h2>
        <span className="cmsappuuid">{props.app.uuid}</span>
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <SelectButton
          selectItem={() => {
            props.session.handleSelectApp(props.app.uuid);
          }}
          sel={props.session.state.selApp === props.app.uuid}
          style={{ marginBottom: "auto" }}
        />
        <button
          className="flatbut cmsappmanage"
          style={{
            padding: "5px",
            marginLeft: "auto",
            marginTop: "auto"
          }}
          onClick={() => {
            usePageStore.getState().handleShowModal("editappform", props.app);
          }}
        >
          <i className="material-icons">more_horiz</i>
        </button>
      </div>
    </div>
  );
};

const getClassNames = (uuid, selApp) => {
  return selApp === uuid ? "cmsappitem selappdiv" : "cmsappitem";
};

export default AppItem;
