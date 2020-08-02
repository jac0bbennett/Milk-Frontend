import React from "react";
import { Truncate } from "../../../utils/text";

const AssetItem = props => {
  return (
    <div className="secondaryitemcont" style={{ alignItems: "center" }}>
      <div
        className="assetimg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50px",
          height: "50px",
          overflow: "hidden"
        }}
      >
        <img
          src={"//cdn.jwb.cloud/file/jwb-cloud/" + props.asset.url}
          alt={props.asset.description}
          height="50px"
        />
      </div>
      <h3>{Truncate(props.asset.name, 32)}</h3>
    </div>
  );
};

export default AssetItem;
