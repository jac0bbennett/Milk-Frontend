import React, { useState, useEffect } from "react";
import AppItem from "./appItem";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";

const AppList = props => {
  const [isLoaded, setIsLoaded] = useState(0);
  const [appCount, setAppCount] = useState(0);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    props.page.handlePageChange("Your Apps", "apps");
    props.loadbar.progressTo(15);
    const req = async () => {
      const resp = await getRequest("/api/panel/apps");
      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        setApps(resp.data.apps);
        setAppCount(resp.meta.appCount);
        setIsLoaded(true);
        props.session.handleSession(userId, selApp, undefined);
        props.loadbar.progressTo(100);
      }
    };

    req();
  }, [props.page, props.session, props.loadbar, props.page.state.refreshView]);

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
          onClick={() => props.page.handleShowModal("newappform")}
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
        <span className="floatright contentstatus">{appCount} / 10</span>
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
