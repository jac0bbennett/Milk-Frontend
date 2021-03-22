import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import TypeItem from "./typeItem";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import { statuses } from "../../../utils/requests";
import usePageStore from "../../../stores/usePageStore";
import useViewApiCall from "../../../utils/useViewApiCall";

const ContentTypeList = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typeCount, setTypeCount] = useState(0);
  const [typeLimit, setTypeLimit] = useState(0);
  const [types, setTypes] = useState([]);

  const [respData, respStatus] = useViewApiCall(
    "/api/panel/apps/" + props.match.params.appuuid + "/types"
  );

  useEffect(() => {
    usePageStore.getState().handlePageChange("Content Types", "types");
    if (respStatus === statuses.SUCCESS) {
      setTypes(respData.types);
      setTypeCount(respData.typeCount);
      setTypeLimit(respData.typeLimit);
      setIsLoaded(true);
    }
  }, [respData, respStatus, props.match.params.appuuid]);

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
          onClick={() => usePageStore.getState().handleShowModal("newtypeform")}
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
      <FAB modalComp="newtypeform">
        <i className="material-icons">add</i>
      </FAB>
      {types.length > 0 ? (
        types.map(type => (
          <TypeItem
            key={type.id}
            type={type}
            url={
              "/panel/apps/" +
              props.match.params.appuuid +
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
