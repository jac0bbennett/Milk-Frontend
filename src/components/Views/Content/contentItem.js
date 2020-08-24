import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

const ContentItem = props => {
  const getStatus = () => {
    if (props.content.status === 0) {
      return <span className="softtext">Draft</span>;
    } else if (
      props.content.editedAt < props.content.publishedAt &&
      props.content.editedAt !== props.content.updatedAt
    ) {
      return (
        <React.Fragment>
          <span
            className="yellowtext"
            title={new Date(props.content.publishedAt)}
          >
            Published
          </span>
          <span className="softtext"> (Pending draft)</span>
        </React.Fragment>
      );
    } else if (new Date(props.content.publishedAt) > new Date()) {
      return (
        <span className="bluetext" title={new Date(props.content.publishedAt)}>
          {moment().diff(props.content.publishedAt, "months") >= 10 ? (
            <Moment format="MMM Do YYYY, h:mma">
              {props.content.publishedAt}
            </Moment>
          ) : (
            <Moment format="MMM Do, h:mma">{props.content.publishedAt}</Moment>
          )}
        </span>
      );
    } else {
      return (
        <span className="greentext" title={new Date(props.content.publishedAt)}>
          Published
        </span>
      );
    }
  };

  return (
    <div className="secondaryitemcont" style={{ flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          className="softtext"
          style={{ fontSize: "11pt", color: "#808080" }}
        >
          {props.content.typeName}
        </span>
        <span className="contentstatus">{getStatus()}</span>
      </div>
      <Link to={props.url}>
        <h2>
          {props.content.title &&
          props.content.fields[props.content.title] &&
          props.content.fields[props.content.title].draft &&
          props.content.fields[props.content.title].draft.replace(/\s/g, "")
            .length
            ? props.content.fields[props.content.title].draft || "Untitled"
            : "Untitled"}
        </h2>
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <span className="softtext" style={{ fontSize: "11pt", cursor: "text" }}>
          {props.content.uuid}
        </span>
        <div
          className="softtext"
          title={new Date(props.content.editedAt)}
          style={{ fontSize: "11pt", textAlign: "right", marginTop: "auto" }}
        >
          <Moment fromNow>{props.content.editedAt}</Moment>
        </div>
      </div>
    </div>
  );
};

export default ContentItem;
