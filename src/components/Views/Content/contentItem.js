import React from "react";
import { Link } from "react-router-dom";
import TimeAgoStamp from "../../UI/Misc/timeAgoStamp";

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
    <Link to={props.url}>
      <div className={"secondaryitemcont"}>
        <span
          className="softtext"
          style={{ fontSize: "11pt", color: "#808080" }}
        >
          {props.content.typeName}
        </span>
        <span className="floatright contentstatus" style={{ marginTop: "5px" }}>
          {getStatus()}
        </span>
        <h2>
          {props.content.content.title &&
          props.content.content.title.draft.replace(/\s/g, "").length
            ? props.content.content.title.draft || "Untitled"
            : "Untitled"}
        </h2>
        <span className="softtext" title={new Date(props.content.editedAt)}>
          <TimeAgoStamp style={{ fontSize: "11pt" }}>
            {props.content.editedAt}
          </TimeAgoStamp>
        </span>
      </div>
    </Link>
  );
};

export default ContentItem;
