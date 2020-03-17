import React, { useState, useEffect, useCallback } from "react";
import FAB from "../../UI/Buttons/fab";
import { getRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import ContentItem from "./contentItem";
import BottomScrollListener from "react-bottom-scroll-listener";
import DropDownInput from "../../UI/Inputs/dropInput";
import TextInput from "../../UI/Inputs/txtInput";
import history from "../../../utils/history";

const ContentList = props => {
  const [contents, setContents] = useState([]);
  const [types, setTypes] = useState([]);
  const [contentsLoaded, setContentsLoaded] = useState(false);
  const [typesLoaded, setTypesLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [contentsCount, setContentsCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("dateDescending");

  const getContents = useCallback(async () => {
    if (!loadedAll) {
      const getFilter = () => {
        const params = new URLSearchParams(props.location.search);

        const paramSearch = params.get("search");
        const paramTypeFilter = params.get("contentType");
        const paramSortOrder = params.get("sort");

        let filter = {};

        if (paramSearch) {
          setSearch(paramSearch);
          setShowSearch(true);
          filter.search = paramSearch;
        } else {
          setSearch("");
        }

        if (paramSortOrder) {
          setSortOrder(paramSortOrder);
          filter.sortOrder = paramSortOrder;
        } else {
          setSortOrder("dateDescending");
        }

        if (paramTypeFilter) {
          setTypeFilter(paramTypeFilter);
          filter.contentType = paramTypeFilter;
        } else {
          setTypeFilter("");
        }

        return filter;
      };

      const resp = await getRequest(
        "/api/panel/apps/" +
          props.match.params.appuuid +
          "/content?page=" +
          nextPage +
          "&q=" +
          JSON.stringify(getFilter())
      );
      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        const selAppName = resp.meta.appName;
        const respContents = resp.data.contents;
        if (nextPage > 1) {
          setContents(c => c.concat(respContents));
        } else {
          setContents(respContents);
        }
        setContentsLoaded(true);
        if (nextPage > 1 && resp.data.contents.length === 0) {
          setLoadedAll(true);
        }
        setContentsCount(resp.data.contentCount);
        props.session.handleSession(userId, selApp, selAppName);
      }
    }
  }, [
    props.loadbar,
    props.session,
    nextPage,
    props.match.params.appuuid,
    props.location.search,
    loadedAll
  ]);

  const getTypes = useCallback(async () => {
    const resp = await getRequest(
      "/api/panel/apps/" + props.match.params.appuuid + "/types"
    );
    if (resp.error) {
      props.loadbar.setToError(true);
      alert("Could not load some data!");
    } else {
      setTypes(resp.data.types);
      setTypesLoaded(true);
    }
  }, [props.match.params.appuuid, props.loadbar]);

  useEffect(() => {
    props.page.handlePageChange("Content", "contents");
    setContentsLoaded(false);
    props.loadbar.progressTo(15);
    getContents();
  }, [loadedAll, props.loadbar, props.page, getContents, getTypes]);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  useEffect(() => {
    if (contentsLoaded && typesLoaded) {
      props.loadbar.progressTo(100);
      setIsLoaded(true);
    } else if (contentsLoaded || typesLoaded) {
      props.loadbar.progressTo(60);
    }
  }, [contentsLoaded, typesLoaded, props.loadbar]);

  const updateUrlParam = (param, value) => {
    let params = new URLSearchParams(props.location.search);

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    history.push(window.location.pathname + "?" + params.toString());
  };

  const handleSearchChange = event => {
    const query = event.target.value;
    setSearch(query);
  };

  const handleSearch = event => {
    event.preventDefault();

    updateUrlParam("search", search);
  };

  const handleFilterType = event => {
    const typeslug = event.target.value;
    if (typeslug !== "0") {
      setTypeFilter(typeslug);
      updateUrlParam("contentType", typeslug);
    } else {
      setTypeFilter("");
      if (sortOrder === "contentType") {
        const fakeEvent = { target: { value: "" } };
        handleSortOrder(fakeEvent);
      }
      updateUrlParam("contentType", null);
    }

    document.activeElement.blur();
  };

  const handleSortOrder = event => {
    const order = event.target.value;
    setSortOrder(order);
    updateUrlParam("sort", order);
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
      <div className="flexspacebetween">
        <MiniHeader header="Content" />
        {isLoaded ? (
          <React.Fragment>
            <span className="pageData">
              <button
                className="flatbut darkflatbutton"
                style={{
                  marginRight: "10px",
                  paddingLeft: "8px",
                  paddingRight: "8px"
                }}
                onClick={() => {
                  setShowSearch(!showSearch);
                  updateUrlParam("search", null);
                }}
              >
                <i
                  className={
                    !showSearch ? "material-icons" : "material-icons bluetext"
                  }
                >
                  search
                </i>
              </button>
              <span className="hidesmallscreen">
                <DropDownInput
                  name="contenttype"
                  label="Filter Type"
                  onChange={handleFilterType}
                  value={typeFilter}
                  required={true}
                  style={{
                    display: "inline-block",
                    width: "150px",
                    marginRight: "20px"
                  }}
                >
                  <option value={"0"}>No Filter</option>
                  {types.map(type => (
                    <option key={type.id} value={type.slug}>
                      {type.slug}
                    </option>
                  ))}
                </DropDownInput>

                <DropDownInput
                  name="sort"
                  label="Sort"
                  onChange={handleSortOrder}
                  value={sortOrder}
                  required={true}
                  style={{ display: "inline-block", width: "150px" }}
                >
                  <option value="dateDescending">Last Edited</option>
                  <option value="dateAscending">Oldest Edited</option>
                  <option value="pubDateDescending">Last Published</option>
                  <option value="pubDateAscending">Oldest Published</option>
                  <option value="title">Title Alphabetical</option>
                  {typeFilter === "" ? (
                    <option value="contentType">Content Type</option>
                  ) : null}
                </DropDownInput>
              </span>
              <span className="contentstatus" style={{ marginLeft: "20px" }}>
                {contentsCount} / 1000
              </span>
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
      {isLoaded && showSearch ? (
        <form onSubmit={handleSearch} className="contentsearch">
          <TextInput
            name="search"
            type="text"
            label="Search"
            value={search}
            onChange={handleSearchChange}
            required={false}
          />
        </form>
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
          <center>
            {loadedAll ? (
              <span className="softtext" style={{ paddingBottom: "30px" }}>
                El Fin
              </span>
            ) : contents.length >= 20 ? (
              <div className="loadingicon" style={{ marginBottom: "30px" }} />
            ) : null}
          </center>
          {contents.length >= 20 && !loadedAll ? (
            <BottomScrollListener
              offset={500}
              onBottom={() => setNextPage(nextPage + 1)}
            />
          ) : null}
        </React.Fragment>
      ) : isLoaded ? (
        typeFilter === "" && search === "" ? (
          <NoAppMsg />
        ) : (
          <div id="midmsg">
            <span style={{ fontSize: "14pt" }} className="softtext">
              <br />
              <br />
              No content matching your filter.
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
