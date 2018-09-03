import React from "react";
import SelectButton from "./selectButton";

const AppItem = props => {
  return (
    <div className={getClassNames(props.app.uuid, props.selApp)}>
      <SelectButton
        selectItem={() => {
          props.onSelectApp(props.app.uuid);
        }}
        sel={props.selApp === props.app.uuid}
      />
      <h2 className="cmsappname">{props.app.name}</h2>
      <button
        className="flatbut cmsappmanage"
        style={{
          float: "right",
          padding: "5px",
          marginBottom: "5px"
        }}
      >
        <i className="material-icons">more_horiz</i>
      </button>
      <span style={{ fontSize: "9pt" }}>UUID:</span>{" "}
      <span className="cmsappuuid">{props.app.uuid}</span>
    </div>
  );
};

const getClassNames = (uuid, selApp) => {
  return selApp === uuid ? "cmsappitem selappdiv" : "cmsappitem";
};

export default AppItem;
