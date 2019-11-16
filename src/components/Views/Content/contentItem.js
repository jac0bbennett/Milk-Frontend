import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const ContentItem = props => {
  const getStatus = () => {
    if (props.content.status === 0) {
      return <span className="softtext">Draft</span>;
    } else if (
      props.content.editedAt !== props.content.publishedAt &&
      props.content.editedAt !== props.content.updatedAt
    ) {
      return (
        <React.Fragment>
          <span className="yellowtext">Published</span>
          <span className="softtext"> (Pending draft)</span>
        </React.Fragment>
      );
    } else {
      return <span className="greentext">Published</span>;
    }
  };

  return (
    <div className="secondaryitemcont">
      <div>
        <span
          className="softtext"
          style={{ fontSize: "11pt", color: "#808080" }}
        >
          {props.content.typeName}
        </span>
        <Link to={props.url}>
          <h2>
            {props.content.content.title &&
            props.content.content.title.draft &&
            props.content.content.title.draft.replace(/\s/g, "").length
              ? props.content.content.title.draft || "Untitled"
              : "Untitled"}
          </h2>
        </Link>
        <span className="softtext" style={{ fontSize: "11pt", cursor: "text" }}>
          {props.content.uuid}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto"
        }}
      >
        <div className="contentstatus" style={{ textAlign: "right" }}>
          {getStatus()}
        </div>

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
