import React from "react";
import SelectButton from "../../UI/Buttons/selectButton";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";

const AppItem = props => {
  const selApp = useSessionStore(state => state.selApp);

  const getClassNames = () => {
    return selApp === props.app.uuid ? "cmsappitem selappdiv" : "cmsappitem";
  };

  return (
    <div className={getClassNames()}>
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
            useSessionStore
              .getState()
              .handleSelectApp(props.app.uuid, props.app.name);
          }}
          sel={selApp === props.app.uuid}
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

export default AppItem;
