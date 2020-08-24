import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

const ContentItem = props => {
  const editedAt = new Date(props.content.editedAt);
  const publishedAt = new Date(props.content.publishedAt);
  const updatedAt = new Date(props.content.updatedAt);
  const getStatus = () => {
    if (props.content.status === 0) {
      return <span className="softtext">Draft</span>;
    } else if (editedAt < publishedAt && editedAt !== updatedAt) {
      return (
        <React.Fragment>
          <span className="yellowtext" title={publishedAt}>
            Published
          </span>
          <span className="softtext"> (Pending draft)</span>
        </React.Fragment>
      );
    } else if (publishedAt > new Date()) {
      return (
        <span className="bluetext" title={publishedAt}>
          {moment().diff(publishedAt, "months") >= 10 ? (
            <Moment format="MMM Do YYYY, h:mma">{publishedAt}</Moment>
          ) : (
            <Moment format="MMM Do, h:mma">{publishedAt}</Moment>
          )}
        </span>
      );
    } else {
      return (
        <span className="greentext" title={publishedAt}>
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
