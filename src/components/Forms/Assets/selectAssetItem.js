import React from "react";

const SelectAssetItem = props => {
  return (
    <div
      className="selectassetimg"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "150px",
        height: "150px",
        overflow: "hidden"
      }}
      onClick={() => props.selectImage(props.asset.url)}
    >
      <img src={props.asset.url} alt={props.asset.description} height="150px" />
    </div>
  );
};

export default SelectAssetItem;
