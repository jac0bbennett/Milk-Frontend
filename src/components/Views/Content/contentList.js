import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";

const ContentList = props => {
  const [contents, setContents] = useState([]);
  const [types, setTypes] = useState([]);
  const [contentsLoaded, setContentsLoaded] = useState(false);
  const [typesLoaded, setTypesLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Content", "content");
    props.session.handleSession(undefined, props.match.params.appuuid);

    getContents(props.match.params.appuuid);
    getTypes(props.match.params.appuuid);
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      getContents();
      getTypes();
      props.page.handleSetRefresh(false);
    }
  }, [props.page.state.refreshView]);

  useEffect(() => {
    if (contentsLoaded && typesLoaded) {
      props.loadbar.progressTo(100);
      setIsLoaded(true);
    } else if (contentsLoaded || typesLoaded) {
      props.loadbar.progressTo(60);
    }
  }, [contentsLoaded, typesLoaded]);

  const getContents = async (uuid = props.session.state.selApp) => {
    const resp = await getRequest("/api/panel/apps/" + uuid + "/content");

    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const respContents = resp.data.contents;
      const selApp = resp.meta.appUUID;
      setContents(respContents);
      setContentsLoaded(true);
      props.session.handleSession(userId, selApp);
    }
  };

  const getTypes = async (uuid = props.session.state.selApp) => {
    const resp = await getRequest("/api/panel/apps/" + uuid + "/types");

    if (resp.error) {
      props.loadbar.setToError(true);
      alert("Could not load some data!");
    } else {
      const respTypes = resp.data.types;
      setTypes(respTypes);
      setTypesLoaded(true);
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
          You haven&#39;t added any content for this app.
        </span>
        <br />
        <br />
        <br />
        {typesLoaded ? (
          <button
            style={{ fontSize: "9pt" }}
            onClick={() =>
              props.page.handleShowModal("newcontentform", { types: types })
            }
            className="raisedbut"
          >
            <span className="icolab">Create One</span>
            <i style={{ fontSize: "11pt" }} className="material-icons">
              add
            </i>
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div>
      <MiniHeader header={props.session.state.selAppName} />
      {typesLoaded ? (
        <FAB
          page={props.page}
          modalComp="newcontentform"
          modalData={{ types: types }}
        >
          <i className="material-icons">add</i>
        </FAB>
      ) : null}
      {contents.length > 0 ? (
        contents.map(content => (
          <span key={content.uuid}>
            {content.uuid} | {content.type_name}
            <br />
          </span>
        ))
      ) : isLoaded ? (
        <NoAppMsg />
      ) : (
        <br />
      )}
    </div>
  );
};

export default ContentList;
