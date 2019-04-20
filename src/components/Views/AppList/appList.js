import React, { useState, useEffect } from "react";
import AppItem from "./appItem";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";

const AppList = props => {
  const [apps, setApps] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Your Apps", "apps");
    getApps();
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      getApps();
      props.page.handleSetRefresh(false);
    }
  }, [props.page.state.refreshView]);

  const getApps = async () => {
    const resp = await getRequest("/api/panel/apps");
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const respApps = resp.data.apps;
      const selApp = resp.meta.appUUID;
      setApps(respApps);
      setIsLoaded(true);
      props.session.handleSession(userId, selApp);
      props.loadbar.progressTo(100);
    }
  };

  const NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            sentiment_very_dissatisfied
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
    <div>
      <FAB page={props.page} modalComp="newappform">
        <i className="material-icons">add</i>
      </FAB>
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
