import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import TypeItem from "./typeItem";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";

const ContentTypeList = props => {
  const [types, setTypes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Content Types", "types");
    props.session.handleSession(undefined, props.match.params.appuuid);
    props.page.handleCloseModal();
    getTypes(props.match.params.appuuid);
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      getTypes();
      props.page.handleSetRefresh(false);
    }
  }, [props.page.state.refreshView]);

  const getTypes = async (uuid = props.session.state.selApp) => {
    const resp = await getRequest("/api/panel/apps/" + uuid + "/types");
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const respTypes = resp.data.types;
      const selApp = resp.meta.appUUID;
      setTypes(respTypes);
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
          You don&#39;t have any content types for this app.
        </span>
        <br />
        <br />
        <br />
        <button
          style={{ fontSize: "9pt" }}
          onClick={() => props.page.handleShowModal("newtypeform")}
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
      <FAB page={props.page} modalComp="newtypeform">
        <i className="material-icons">add</i>
      </FAB>
      {types.length > 0 ? (
        types.map(type => (
          <TypeItem
            key={type.id}
            type={type}
            session={props.session}
            page={props.page}
            url={
              "/panel/apps/" +
              props.session.state.selApp +
              "/types/" +
              type.slug
            }
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

export default ContentTypeList;
