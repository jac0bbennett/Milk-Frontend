import React, { useState } from "react";
import { Truncate } from "../../../utils/text";
import { CopyToClipboard } from "react-copy-to-clipboard";

const AssetItem = props => {
  const [asset, setAsset] = useState(props.asset);
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="secondaryitemcont"
      style={{ alignItems: "center", flexWrap: "wrap" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", overflowX: "hidden" }}
      >
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
          <img src={asset.url} alt={asset.description} height="50px" />
        </div>
        <h3 style={{ marginLeft: "20px" }}>{Truncate(asset.name, 32)}</h3>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <CopyToClipboard text={asset.url}>
          <button
            className="flatbut"
            title="Copy Url"
            style={{
              padding: "5px",
              height: "60px"
            }}
            onClick={() => setCopied(true)}
          >
            <i
              style={{
                paddingRight: "10px",
                paddingLeft: "10px"
              }}
              className="material-icons"
            >
              content_copy
            </i>
            {copied ? <span className="greentext"> Copied</span> : null}
          </button>
        </CopyToClipboard>
        <button
          className="flatbut"
          title="Edit"
          style={{
            padding: "5px",
            height: "60px",
            marginLeft: "5px"
          }}
          onClick={() =>
            props.page.handleShowModal("editassetform", {
              asset: asset,
              callback: a => {
                setAsset(a);
              }
            })
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
