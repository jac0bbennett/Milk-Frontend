import React, { useState, useEffect } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";

const BooleanField = props => {
  const [content, setContent] = useState(props.value);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (saved) {
      setMsg("Saved to draft");
    }
  }, [saved]);

  const autoSave = async newVal => {
    const fieldcontentid = props.dataId;

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/content/" +
        props.contentUuid,
      { [fieldcontentid]: newVal }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.drafting(false);
    } else {
      props.drafting(false);
      props.updateEditedTime(req.edited);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
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
    <div style={{ marginBottom: "10px" }}>
      <h4 style={{ marginBottom: "5px" }}>{props.label}</h4>
      <input
        type="radio"
        name={props.dataId}
        label={props.label}
        value="True"
        onChange={handleChange}
        required={false}
        disabled={props.disabled}
        checked={content === "True"}
      />
      True
      <input
        type="radio"
        name={props.dataId}
        label={props.label}
        value="False"
        onChange={handleChange}
        required={false}
        disabled={props.disabled}
        style={{ marginLeft: "10px" }}
        checked={content === "False"}
      />
      False <br />
      <FieldMsg msg={msg} />
    </div>
  );
};

export default BooleanField;
