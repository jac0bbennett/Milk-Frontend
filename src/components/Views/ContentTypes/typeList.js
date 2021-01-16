import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import TypeItem from "./typeItem";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import { getRequest } from "../../../utils/requests";

const ContentTypeList = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typeCount, setTypeCount] = useState(0);
  const [typeLimit, setTypeLimit] = useState(0);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    props.page.handlePageChange("Content Types", "types");
    const req = async () => {
      const resp = await getRequest(
        "/api/panel/apps/" + props.match.params.appuuid + "/types"
      );

      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        const selAppName = resp.meta.appName;
        setTypes(resp.data.types);
        setTypeCount(resp.data.typeCount);
        setTypeLimit(resp.data.typeLimit);
        setIsLoaded(true);
        props.session.handleSession(userId, selApp, selAppName);
        props.loadbar.progressTo(100);
      }
    };
    props.loadbar.progressTo(15);
    req();
  }, [
    props.page.state.refreshView,
    props.match.params.appuuid,
    props.loadbar,
    props.session,
    props.page
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
      <MiniHeader header="Content Types" />
      {isLoaded ? (
        <span className="pageData">
          <span className="floatright contentstatus">
            {typeCount} / {typeLimit}
          </span>
        </span>
      ) : null}
      <FAB page={props.page} modalComp="newtypeform">
        <i className="material-icons">add</i>
      </FAB>
      {types.length > 0 ? (
        types.map(type => (
          <TypeItem
            key={type.id}
            type={type}
            session={props.session}
            loadbar={props.loadbar}
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
