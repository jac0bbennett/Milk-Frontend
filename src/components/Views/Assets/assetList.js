import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    props.page.handlePageChange("Your Assets", "assets");
    props.loadbar.progressTo(15);
    const getAssets = async n => {
      if (!loadedAll) {
        const resp = await getRequest(
          "/api/panel/apps/" + props.match.params.appuuid + "/assets?page=" + n
        );
        if (resp.error) {
          props.loadbar.setToError(true);
        } else {
          const userId = resp.meta.userId;
          const selApp = resp.meta.appUUID;
          const selAppName = resp.meta.appName;
          const respAssets = resp.data.assets;
          if (n > 1) {
            setAssets(c => c.concat(respAssets));
          } else {
            setAssets(respAssets);
          }
          if (n > 1 && resp.data.assets.length === 0) {
            setLoadedAll(true);
          } else if (n === 1) {
            setIsLoaded(true);
          }
          props.loadbar.progressTo(100);
          setAssetCount(resp.data.assetCount);
          props.session.handleSession(userId, selApp, selAppName);
        }
      }
    };
    getAssets(nextPage);
  }, [
    props.page,
    props.loadbar,
    props.session,
    nextPage,
    props.match.params.appuuid,
    loadedAll
  ]);

  useEffect(() => {
    if ("removedAsset" in props.page.state.modalData) {
      const removedId = props.page.state.modalData.removedAsset;
      setAssets(c => c.filter(a => a.id !== removedId));
    }
  }, [props.page.state.modalData]);

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
            props.page.handleShowModal("uploadassetform", {
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
        <span className="floatright contentstatus">{assetCount} / 500</span>
      </span>
      <FAB
        page={props.page}
        modalComp="uploadassetform"
        modalData={{ callback: uploadCallback }}
      >
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
