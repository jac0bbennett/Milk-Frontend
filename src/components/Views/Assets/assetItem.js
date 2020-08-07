import React from "react";
import { Truncate } from "../../../utils/text";
import Moment from "react-moment";

const AssetItem = props => {
  return (
    <div
      className="secondaryitemcont"
      style={{ alignItems: "center", flexWrap: "wrap" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="assetimg"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "50px",
            width: "50px",
            height: "50px",
            overflow: "hidden"
          }}
        >
          <img
            src={"//cdn.jwb.cloud/file/milk-uploads/" + props.asset.url}
            alt={props.asset.description}
            height="50px"
          />
        </div>
        <h3 style={{ marginLeft: "20px", textOverflow: "" }}>
          {Truncate(props.asset.name, 32)}
        </h3>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <span
          className="softtext"
          style={{ fontSize: "11pt" }}
          title={new Date(props.asset.createdAt)}
        >
          <Moment fromNow>{props.asset.createdAt}</Moment>
        </span>
        <button
          className="flatbut"
          style={{
            padding: "5px",
            height: "60px",
            marginLeft: "15px"
          }}
          onClick={() =>
            props.page.handleShowModal("editassetform", props.asset)
          }
        >
          <i
            style={{
              paddingRight: "10px",
              paddingLeft: "10px"
            }}
            className="material-icons"
          >
            more_vert
          </i>
        </button>
      </div>
    </div>
  );
};

export default AssetItem;
