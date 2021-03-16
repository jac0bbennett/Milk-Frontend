import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import { statuses } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import usePageStore from "../../../stores/usePageStore";
import useViewApiCall from "../../../utils/useViewApiCall";

const AppApiKeys = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [keys, setKeys] = useState([]);

  const [respData, respStatus] = useViewApiCall(
    "/api/panel/apps/" + props.match.params.appuuid + "/apikeys"
  );

  useEffect(() => {
    usePageStore.getState().handlePageChange("API Keys", "apikeys");

    if (respStatus === statuses.SUCCESS) {
      setKeys(respData.keys);
      setKeyCount(respData.keyCount);
      setIsLoaded(true);
    }
  }, [props.match.params.appuuid, respData, respStatus]);

  const NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            inbox
          </i>
          <br />
          <br />
          No API keys have been created for this app.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() =>
            usePageStore.getState().handleShowModal("newapikeyform")
          }
          className="raisedbut"
        >
          <span className="icolab">Create One</span>
          <i style={{ fontSize: "11pt" }} className="material-icons">
            add
          </i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <MiniHeader header="API Keys" />
      <span className="pageData" style={{ marginBottom: "15px" }}>
        <span className="floatright contentstatus">{keyCount} / 10</span>
      </span>
      <FAB modalComp="newapikeyform">
        <i className="material-icons">add</i>
      </FAB>
      <br />
      {keys.length > 0 ? (
        keys.map(key => (
          <div
            key={key.key}
            className="secondaryitemcont"
            style={{ flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h2>{key.name}</h2>
              <button
                className="flatbut"
                style={{
                  padding: "5px"
                }}
                onClick={() =>
                  usePageStore
                    .getState()
                    .handleShowModal("editapikeyform", { key: key })
                }
              >
                <i
                  style={{ paddingRight: "20px", paddingLeft: "20px" }}
                  className="material-icons"
                >
                  create
                </i>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <h3 className="cmsappuuid">{key.key}</h3>
              <span className="softtext">
                {key.access === "published" ? "Only Published" : "All Content"}
              </span>
            </div>
          </div>
        ))
      ) : isLoaded ? (
        <NoAppMsg />
      ) : (
        <br />
      )}
    </div>
  );
};

export default AppApiKeys;
