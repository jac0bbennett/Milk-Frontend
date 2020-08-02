import React, { useState, useEffect, useCallback } from "react";
import AssetItem from "./assetItem";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import BottomScrollListener from "react-bottom-scroll-listener";
import { MiniHeader } from "../../UI/Misc/miniHeader";

const AssetList = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [nextPage, setNextPage] = useState(1);

  const getAssets = useCallback(async () => {
    if (!loadedAll) {
      const resp = await getRequest(
        "/api/panel/apps/" +
          props.match.params.appuuid +
          "/assets?page=" +
          nextPage
      );
      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        const selAppName = resp.meta.appName;
        const respAssets = resp.data.assets;
        if (nextPage > 1) {
          setAssets(c => c.concat(respAssets));
        } else {
          setAssets(respAssets);
        }
        if (nextPage > 1 && resp.data.assets.length === 0) {
          setLoadedAll(true);
        } else if (nextPage === 1) {
          setIsLoaded(true);
        }
        props.loadbar.progressTo(100);
        setAssetCount(resp.data.assetCount);
        props.session.handleSession(userId, selApp, selAppName);
      }
    }
  }, [
    props.loadbar,
    props.session,
    nextPage,
    loadedAll,
    props.match.params.appuuid
  ]);

  useEffect(() => {
    props.page.handlePageChange("Your Assets", "assets");
    props.loadbar.progressTo(15);
    getAssets();
  }, [props.page, props.loadbar, getAssets]);

  useEffect(() => {
    if ("newAsset" in props.page.state.modalData) {
      setAssets(c => [props.page.state.modalData.newAsset, ...c]);
      setAssetCount(c => c + 1);
    }
  }, [props.page.state.modalData]);

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
          onClick={() => props.page.handleShowModal("uploadassetform")}
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
        <span className="floatright contentstatus">{assetCount} / 500</span>
      </span>
      <FAB page={props.page} modalComp="uploadassetform">
        <i className="material-icons">add</i>
      </FAB>
      <div className="assetlist">
        {assets.length > 0 ? (
          <React.Fragment>
            {assets.map(asset => (
              <AssetItem
                key={asset.url}
                asset={asset}
                session={props.session}
                page={props.page}
              />
            ))}
            <center>
              {loadedAll ? (
                <span className="softtext" style={{ paddingBottom: "30px" }}>
                  El Fin
                </span>
              ) : assets.length >= 20 ? (
                <div className="loadingicon" style={{ marginBottom: "30px" }} />
              ) : null}
            </center>
            {assets.length >= 20 && !loadedAll ? (
              <BottomScrollListener
                offset={500}
                onBottom={() => setNextPage(nextPage + 1)}
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
