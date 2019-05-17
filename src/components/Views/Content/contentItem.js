import React from "react";
import { Link } from "react-router-dom";
import ago from "s-ago";

const ContentItem = props => {
  return (
    <Link to={props.url}>
      <div className={"secondaryitemcont"}>
        <h2>
          {props.content.content.title
            ? props.content.content.title
            : "Untitled"}
        </h2>
        <h3 className="softtext" title={new Date(props.content.editedAt)}>
          {ago(new Date(props.content.editedAt))}
        </h3>
      </div>
    </Link>
  );
};

export default ContentItem;
