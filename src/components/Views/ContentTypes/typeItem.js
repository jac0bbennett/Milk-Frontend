import React from "react";
import { Link } from "react-router-dom";
import { postRequest } from "../../../utils/requests";
import history from "../../../utils/history";

const TypeItem = props => {
  const handleCreate = async event => {
    props.loadbar.progressTo(15);

    const typeslug = props.type.slug;

    const req = await postRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/content",
      { typeslug }
    );

    if (req.error) {
      const reqMsg = req.error;
      alert(reqMsg);
      props.loadbar.setToError(true);
    } else {
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      history.push(
        "/panel/apps/" + props.session.state.selApp + "/content/" + req.uuid
      );
    }
  };

  return (
    <div className={"secondaryitemcont"}>
      <span className="floatright">
        <button
          className="flatbut"
          onClick={handleCreate}
          style={{
            padding: "5px"
          }}
        >
          <i
            style={{ paddingRight: "20px", paddingLeft: "20px" }}
            className="material-icons"
          >
            add
          </i>
        </button>
        <Link to={props.url} className="not-text-link">
          <button
            className="flatbut"
            style={{
              padding: "5px"
            }}
          >
            <i
              style={{ paddingRight: "20px", paddingLeft: "20px" }}
              className="material-icons"
            >
              create
            </i>
          </button>
        </Link>
      </span>
      <h2>{props.type.name}</h2>
      <h3 className="softtext">{props.type.slug}</h3>
    </div>
  );
};

export default TypeItem;
