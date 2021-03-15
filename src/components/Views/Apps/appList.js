import React, { useState, useEffect } from "react";
import AppItem from "./appItem";
import FAB from "../../UI/Buttons/fab";
import { statuses } from "../../../utils/requests";
import usePageStore from "../../../stores/usePageStore";
import useViewApiCall from "../../../utils/useViewApiCall";

const AppList = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [appCount, setAppCount] = useState(0);
  const [appLimit, setAppLimit] = useState(0);
  const [apps, setApps] = useState([]);

  const [respData, respMeta, respStatus] = useViewApiCall("/api/panel/apps");

  useEffect(() => {
    usePageStore.getState().handlePageChange("Your Apps", "apps");
    if (respStatus === statuses.SUCCESS) {
      setApps(respData.apps);
      setAppCount(respData.appCount);
      setAppLimit(respData.appLimit);
      setIsLoaded(true);
    }
    props.session.handleSession(respMeta.userId, respMeta.selApp, undefined);
  }, [props.session, respData, respMeta, respStatus]);

  const NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            inbox
          </i>
          <br />
          <br />
          You don&#39;t have any apps.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() => usePageStore.getState().handleShowModal("newappform")}
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
    <div className="applist">
      <span className="pageData" style={{ marginBottom: "15px" }}>
        <span className="floatright contentstatus">
          {appCount} / {appLimit}
        </span>
      </span>
      <FAB page={props.page} modalComp="newappform">
        <i className="material-icons">add</i>
      </FAB>
      <br />
      {apps.length > 0 ? (
        apps.map(app => (
          <AppItem
            key={app.uuid}
            app={app}
            session={props.session}
            page={props.page}
          />
        ))
      ) : isLoaded ? (
        <NoAppMsg />
      ) : (
        <br />
      )}
    </div>
  );
};

export default AppList;
