import React, { useState, useEffect } from "react";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import ContentItem from "./contentItem";
import BottomScrollListener from "react-bottom-scroll-listener";
import DropDownInput from "../../UI/Inputs/dropInput";

const ContentList = props => {
  const [contents, setContents] = useState([]);
  const [types, setTypes] = useState([]);
  const [contentsLoaded, setContentsLoaded] = useState(false);
  const [typesLoaded, setTypesLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [contentsCount, setContentsCount] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    props.page.handlePageChange("Content", "contents");
    props.session.handleSession(undefined, props.match.params.appuuid);

    getContents(1, props.match.params.appuuid);
    getTypes(props.match.params.appuuid);
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      setContents([]);
      getContents(1);
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

  const getContents = async (
    page = nextPage,
    uuid = props.session.state.selApp,
    filter = {},
    reset = false
  ) => {
    if (!loadedAll) {
      props.loadbar.progressTo(15);
      const resp = await getRequest(
        "/api/panel/apps/" +
          uuid +
          "/content?page=" +
          page +
          "&q=" +
          JSON.stringify(filter)
      );

      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const respContents = resp.data.contents;
        const selApp = resp.meta.appUUID;
        const curContents = [...contents];
        props.loadbar.progressTo(100);
        if (!reset) {
          setContents(curContents.concat(respContents));
        } else {
          setContents(respContents);
        }
        setContentsLoaded(true);
        if (page > 1 && respContents === []) {
          setLoadedAll(true);
        }
        setNextPage(page + 1);
        setContentsCount(resp.meta.contentCount);
        props.session.handleSession(userId, selApp);
      }
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

  const handleFilterType = event => {
    const typeslug = event.target.value;
    if (typeslug !== "0") {
      setTypeFilter(typeslug);
      getContents(1, undefined, { contentType: typeslug }, true);
    } else {
      setTypeFilter("");
      getContents(1, undefined, {}, true);
    }
    document.activeElement.blur();
  };

  const NoAppMsg = () => {
    return (
      <div id="midmsg">
        <span style={{ fontSize: "14pt" }} className="softtext">
          <i style={{ fontSize: "42pt" }} className="material-icons">
            inbox
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
      <div className="contentlistheader">
        <MiniHeader header={props.session.state.selAppName} />
        {isLoaded ? (
          <React.Fragment>
            <span className="hidesmallscreen" style={{ marginTop: "-20px" }}>
              <DropDownInput
                name="contenttype"
                label="Filter Type"
                onChange={handleFilterType}
                value={typeFilter}
                required={true}
                style={{ display: "inline-block" }}
              >
                <option value={"0"}>No Filter</option>
                {types.map(type => (
                  <option key={type.id} value={type.slug}>
                    {type.slug}
                  </option>
                ))}
              </DropDownInput>
            </span>
            <span className="contentstatus hidesmallscreen">
              {contentsCount} / 1000
            </span>
          </React.Fragment>
        ) : null}
      </div>
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
        <React.Fragment>
          {contents.map(content => (
            <ContentItem
              key={content.uuid}
              content={content}
              url={
                "/panel/apps/" +
                props.session.state.selApp +
                "/content/" +
                content.uuid
              }
            />
          ))}
          <BottomScrollListener offset={500} onBottom={getContents} />
        </React.Fragment>
      ) : isLoaded ? (
        typeFilter === "" ? (
          <NoAppMsg />
        ) : (
          <div id="midmsg">
            <span style={{ fontSize: "14pt" }} className="softtext">
              <br />
              <br />
              No content matching that filter.
            </span>
          </div>
        )
      ) : (
        <br />
      )}
    </div>
  );
};

export default ContentList;
