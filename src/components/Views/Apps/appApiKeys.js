import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";

const AppApiKeys = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    props.page.handlePageChange("API Keys", "apikeys");

    const req = async () => {
      const resp = await getRequest(
        "/api/panel/apps/" + props.match.params.appuuid + "/apikeys"
      );
      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        const selAppName = resp.meta.appName;
        setKeys(resp.data.keys);
        setKeyCount(resp.meta.keyCount);
        setIsLoaded(true);
        props.session.handleSession(userId, selApp, selAppName);
        props.loadbar.progressTo(100);
      }
    };

    req();
  }, [
    props.page,
    props.session,
    props.loadbar,
    props.match.params.appuuid,
    props.page.state.refreshView
  ]);

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
          onClick={() => props.page.handleShowModal("newapikeyform")}
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
      <MiniHeader header={props.session.state.selAppName} />
      <span className="pageData" style={{ marginBottom: "15px" }}>
        <span className="floatright contentstatus">{keyCount} / 10</span>
      </span>
      <FAB page={props.page} modalComp="newapikeyform">
        <i className="material-icons">add</i>
      </FAB>
      <br />
      {keys.length > 0 ? (
        keys.map(key => (
          <div key={key.key} className="secondaryitemcont">
            <span className="floatright">
              <button
                className="flatbut"
                style={{
                  padding: "5px"
                }}
                onClick={() =>
                  props.page.handleShowModal("editapikeyform", { key: key })
                }
              >
                <i
                  style={{ paddingRight: "20px", paddingLeft: "20px" }}
                  className="material-icons"
                >
                  create
                </i>
              </button>
            </span>
            <h2>{key.name}</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <h3 className="cmsappuuid">{key.key}</h3>
              <span
                className="floatright softtext"
                style={{ marginTop: "20px" }}
              >
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
