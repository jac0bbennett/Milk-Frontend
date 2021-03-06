import React, { useState, useEffect } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import useSessionStore from "../../../../stores/useSessionStore";

const BooleanField = props => {
  const [content, setContent] = useState(props.value);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const selApp = useSessionStore(state => state.selApp);

  useEffect(() => {
    if (saved) {
      setMsg("Saved to draft");
    }
  }, [saved]);

  const autoSave = async newVal => {
    const fieldcontentid = props.dataId;

    const req = await patchRequest(
      "/api/panel/apps/" + selApp + "/content/" + props.contentUuid,
      { [fieldcontentid]: newVal }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.drafting(false);
    } else {
      props.drafting(false);
      props.updateEditedTime(req.editedAt);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  const handleChange = newValue => {
    setContent(newValue);
    setSaved(false);

    setMsg("saving...");
    props.drafting(true);
    autoSave(newValue);
  };

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent(props.value);
      setMsg("");
    }
  }, [props.isDraftDiscarded, props.value]);

  return (
    <div style={{ marginBottom: "10px", marginTop: "25px" }}>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleChange(content === "True" ? "False" : "True")}
      >
        <span className="icolab" style={{ fontSize: "13pt" }}>
          {props.label}{" "}
        </span>
        <i className="material-icons">
          {content === "True" ? "check_box" : "check_box_outline_blank"}
        </i>{" "}
        <FieldMsg msg={msg} />
      </div>
    </div>
  );
};

export default BooleanField;
