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
    <div
      className="secondaryitemcont"
      style={{ paddingTop: "0px", paddingBottom: "0px" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: "auto",
          justifyContent: "space-around"
        }}
      >
        <h2
          style={{
            marginRight: "20px"
          }}
        >
          {props.type.name}
        </h2>
        <h3
          className="softtext"
          style={{
            marginTop: "-5px"
          }}
        >
          {props.type.slug}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          marginLeft: "auto",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end"
        }}
      >
        <button className="flatbut iconflatbut" onClick={handleCreate}>
          <i className="material-icons">add</i>
        </button>
        <Link to={props.url} className="not-text-link">
          <button className="flatbut iconflatbut" style={{ marginLeft: "5px" }}>
            <i className="material-icons">create</i>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TypeItem;
