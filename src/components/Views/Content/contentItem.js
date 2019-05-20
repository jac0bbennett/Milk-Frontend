import React from "react";
import { Link } from "react-router-dom";
import TimeAgoStamp from "../../UI/Misc/timeAgoStamp";

const ContentItem = props => {
  return (
    <Link to={props.url}>
      <div className={"secondaryitemcont"}>
        <h2>
          {props.content.content.title &&
          props.content.content.title.draft.replace(/\s/g, "").length
            ? props.content.content.title.draft || "Untitled"
            : "Untitled"}
        </h2>
        <h3 className="softtext" title={new Date(props.content.editedAt)}>
          <TimeAgoStamp>{props.content.editedAt}</TimeAgoStamp>
        </h3>
        {props.content.status === 0 ? (
          <span className="softtext">Draft</span>
        ) : (
          <span className="softtext" style={{ color: "#3cc883" }}>
            Published
          </span>
        )}
      </div>
    </Link>
  );
};

export default ContentItem;
