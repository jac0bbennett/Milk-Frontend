import React, { useState, useEffect, useCallback } from "react";
import { getRequest } from "../../../utils/requests";
import SelectAssetItem from "./selectAssetItem";

const SelectAssetForm = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const getAssets = useCallback(async () => {
    if (!loadedAll || nextPage === null) {
      const nPage = nextPage || 1;
      const resp = await getRequest(
        "/api/panel/apps/" +
          props.session.state.selApp +
          "/assets?page=" +
          nPage
      );
      if (resp.error) {
        // props.loadbar.setToError(true);
      } else {
        const respAssets = resp.data.assets;
        setRefreshing(false);
        if (nPage > 1) {
          setAssets(c => c.concat(respAssets));
        } else {
          setAssets(respAssets);
        }
        if (nPage > 1 && resp.data.assets.length < 20) {
          setLoadedAll(true);
        } else if (nPage === 1) {
          setIsLoaded(true);
          setLoadedAll(false);
        }
      }
    }
  }, [nextPage, loadedAll, props.session.state.selApp]);

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  const selectImage = asset => {
    const callbackData = props.page.state.persistentModalData.callbackData
      ? props.page.state.persistentModalData.callbackData
      : null;
    props.page.state.persistentModalData.callback(asset, callbackData);
    props.page.handleCloseModal();
  };

  const refresh = () => {
    setNextPage(null);
    setRefreshing(true);
  };

  const NoAppMsg = () => {
    return (
      <div id="midmsg" style={{ marginTop: "20px", marginBottom: "50px" }}>
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            inbox
          </i>
          <br />
          <br />
          No assets for this app.
        </span>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>Select Asset</h2>
        <div style={{ marginLeft: "auto" }}>
          <i
            className="material-icons hoverblue"
            title="Upload"
            style={{ cursor: "pointer", marginRight: "15px" }}
            onClick={() =>
              props.page.handleShowModal("uploadassetform", {
                callbackOnLast: true,
                callback: () => props.page.handleShowModal("selectassetform")
              })
            }
          >
            publish
          </i>
          <i
            className="material-icons hoverblue"
            title="Refresh"
            style={{ cursor: "pointer" }}
            onClick={() => refresh()}
          >
            refresh
          </i>
        </div>
      </div>
      {refreshing ? (
        <div
          className="loadingicon"
          style={{ margin: "auto", marginBottom: "30px" }}
        />
      ) : null}
      <div className="assetlistmodal">
        {assets.length > 0 ? (
          <React.Fragment>
            {assets.map(asset => (
              <SelectAssetItem
                key={asset.url}
                asset={asset}
                session={props.session}
                page={props.page}
                selectImage={selectImage}
              />
            ))}
            {assets.length >= 20 && !loadedAll ? (
              <button
                className="flatbut"
                onClick={() => {
                  setNextPage(nextPage + 1);
                  setRefreshing(true);
                }}
              >
                Load More
              </button>
            ) : null}
          </React.Fragment>
        ) : isLoaded ? (
          <NoAppMsg />
        ) : (
          <div className="loadingicon" style={{ marginBottom: "30px" }} />
        )}
      </div>
    </div>
  );
};

export default SelectAssetForm;
