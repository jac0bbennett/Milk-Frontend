import React, { useState, useEffect } from "react";
import AssetItem from "./assetItem";
import FAB from "../../UI/Buttons/fab";
import { statuses } from "../../../utils/requests";
import BottomScrollListener from "react-bottom-scroll-listener";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import usePageStore from "../../../stores/usePageStore";
import useViewApiCall from "../../../utils/useViewApiCall";

const AssetList = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [assets, setAssets] = useState([]);
  const [assetLimit, setAssetLimit] = useState(0);
  const [loadedAll, setLoadedAll] = useState(false);
  const [offset, setOffset] = useState(0);

  const modalData = usePageStore(state => state.modalData);

  const [respData, respStatus] = useViewApiCall(
    "/api/panel/apps/" + props.match.params.appuuid + "/assets?offset=" + offset
  );

  useEffect(() => {
    usePageStore.getState().handlePageChange("Your Assets", "assets");
    if (respStatus === statuses.SUCCESS) {
      if (respData.offset > 1) {
        setAssets(c => c.concat(respData.assets));
      } else {
        setAssets(respData.assets);
      }
      setAssetCount(respData.assetCount);
      setAssetLimit(respData.assetLimit);
      setIsLoaded(true);
      if (respData.assets.length < 20) {
        setLoadedAll(true);
      }
    }
  }, [respData, respStatus]);

  useEffect(() => {
    if ("removedAsset" in modalData) {
      const removedId = modalData.removedAsset;
      setAssets(c => c.filter(a => a.id !== removedId));
      setAssetCount(c => c - 1);
    }
  }, [modalData]);

  const uploadCallback = a => {
    setAssets(c => [a, ...c]);
    setAssetCount(c => c + 1);
  };

  const NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            inbox
          </i>
          <br />
          <br />
          No assets for this app.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() =>
            usePageStore.getState().handleShowModal("uploadassetform", {
              callback: uploadCallback
            })
          }
          className="raisedbut"
        >
          <span className="icolab">Add One</span>
          <i style={{ fontSize: "11pt" }} className="material-icons">
            add
          </i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <MiniHeader header="Assets" />
      <span className="pageData" style={{ marginBottom: "15px" }}>
        <span className="floatright contentstatus">
          {assetCount} / {assetLimit}
        </span>
      </span>
      <FAB modalComp="uploadassetform" modalData={{ callback: uploadCallback }}>
        <i className="material-icons">add</i>
      </FAB>
      <div className="assetlist">
        {assets.length > 0 ? (
          <React.Fragment>
            {assets.map(asset => (
              <AssetItem key={asset.url} asset={asset} />
            ))}
            <center>
              {loadedAll && assetCount >= 20 ? (
                <span className="softtext" style={{ paddingBottom: "30px" }}>
                  El Fin
                </span>
              ) : !loadedAll ? (
                <div className="loadingicon" style={{ marginBottom: "30px" }} />
              ) : null}
            </center>
            {!loadedAll ? (
              <BottomScrollListener
                offset={500}
                onBottom={() => setOffset(assets[assets.length - 1].id)}
              />
            ) : null}
          </React.Fragment>
        ) : isLoaded ? (
          <NoAppMsg />
        ) : (
          <br />
        )}
      </div>
    </div>
  );
};

export default AssetList;
