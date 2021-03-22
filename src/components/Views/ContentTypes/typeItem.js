import React from "react";
import { Link } from "react-router-dom";
import { postRequest } from "../../../utils/requests";
import history from "../../../utils/history";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const TypeItem = props => {
  const selApp = useSessionStore(state => state.selApp);

  const handleCreate = async () => {
    useLoadbarStore.getState().progressTo(15);

    const typeslug = props.type.slug;

    const req = await postRequest("/api/panel/apps/" + selApp + "/content", {
      typeslug
    });

    if (req.error) {
      const reqMsg = req.error;
      alert(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      history.push("/panel/apps/" + selApp + "/content/" + req.uuid);
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
