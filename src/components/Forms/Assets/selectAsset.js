import React, { useState, useEffect } from "react";
import { getRequest } from "../../../utils/requests";
import SelectAssetItem from "./selectAssetItem";
import useSessionStore from "../../../stores/useSessionStore";
import usePageStore from "../../../stores/usePageStore";

const SelectAssetForm = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const selApp = useSessionStore(state => state.selApp);
  const persistentModalData = usePageStore(state => state.persistentModalData);

  useEffect(() => {
    const getAssets = async n => {
      if (!loadedAll) {
        const resp = await getRequest(
          "/api/panel/apps/" + selApp + "/assets?page=" + n
        );
        if (resp.error) {
          // props.loadbar.setToError(true);
        } else {
          const respAssets = resp.data.assets;
          if (n > 1) {
            setAssets(c => c.concat(respAssets));
          } else {
            setAssets(respAssets);
          }
          if (n > 1 && resp.data.assets.length < 20) {
            setLoadedAll(true);
          } else if (n === 1) {
            setIsLoaded(true);
            setLoadedAll(false);
          }
        }
        setRefreshing(false);
      }
    };

    getAssets(nextPage || 1);
  }, [nextPage, loadedAll, selApp]);

  const selectImage = asset => {
    const callbackData = persistentModalData.callbackData
      ? persistentModalData.callbackData
      : null;
    persistentModalData.callback(asset, callbackData);
    usePageStore.getState().handleCloseModal();
  };

  const refresh = n => {
    setRefreshing(true);
    setLoadedAll(false);
    setNextPage(n === 1 ? null : 1);
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
              usePageStore.getState().handleShowModal("uploadassetform", {
                callbackOnLast: true,
                callback: () =>
                  usePageStore.getState().handleShowModal("selectassetform")
              })
            }
          >
            publish
          </i>
          <i
            className="material-icons hoverblue"
            title="Refresh"
            style={{ cursor: "pointer" }}
            onClick={() => {
              return !refreshing ? refresh(nextPage) : null;
            }}
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
                selectImage={selectImage}
              />
            ))}
            {assets.length >= 20 && !loadedAll ? (
              <button
                className="flatbut"
                onClick={() => {
                  setNextPage(nextPage ? nextPage + 1 : 2);
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
