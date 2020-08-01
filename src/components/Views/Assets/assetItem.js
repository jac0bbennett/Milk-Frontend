import React from "react";

const AssetItem = props => {
  return (
    <div className="assetitem">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around"
        }}
      >
        <h2>{props.asset.name}</h2>
      </div>
      <img
        src={"//cdn.jwb.cloud/file/jwb-cloud/" + props.asset.url}
        width="40px"
      />
    </div>
  );
};

export default AssetItem;
