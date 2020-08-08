import React, { useState, useEffect, useCallback } from "react";
import { getRequest } from "../../../utils/requests";
import BottomScrollListener from "react-bottom-scroll-listener";
import SelectAssetItem from "./selectAssetItem";

const SelectAssetForm = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const getAssets = useCallback(async () => {
    if (!loadedAll || nextPage === 1) {
      const resp = await getRequest(
        "/api/panel/apps/" +
          props.session.state.selApp +
          "/assets?page=" +
          nextPage
      );
      if (resp.error) {
        // props.loadbar.setToError(true);
      } else {
        const respAssets = resp.data.assets;
        setRefreshing(false);
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
      }
    }
  }, [nextPage, loadedAll, props.session.state.selApp]);

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  const selectImage = url => {
    props.page.state.modalData.callback(url);
    props.page.handleCloseModal();
  };

  const refresh = () => {
    setNextPage(1);
    setRefreshing(true);
    getAssets();
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
      <h2>
        Select Asset
        <i
          className="material-icons floatright"
          title="Refresh"
          style={{ cursor: "pointer" }}
          onClick={() => refresh()}
        >
          refresh
        </i>
      </h2>
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
                offset={200}
                onBottom={() => setNextPage(nextPage + 1)}
              />
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
