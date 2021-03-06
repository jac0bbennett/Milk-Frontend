import React, { useState, useEffect } from "react";
import DropDownInput from "../../../UI/Inputs/dropInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import useSessionStore from "../../../../stores/useSessionStore";

const DropdownField = props => {
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
      setMsg(req.error);
      props.drafting(false);
      props.disablePublish(true);
    } else {
      props.drafting(false);
      props.disablePublish(false);
      props.updateEditedTime(req.editedAt);
      setSaved(true);
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);
    setSaved(false);

    setMsg("saving...");
    props.disablePublish(false);
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
    <div style={{ marginBottom: "10px", marginTop: "30px" }}>
      <DropDownInput
        dataId={props.dataId}
        name={props.slug}
        label={props.label}
        value={content}
        onChange={handleChange}
        required={true}
        autoComplete="off"
        disabled={props.disabled}
      >
        {props.fieldOptions.values && props.fieldOptions.values.length > 0
          ? props.fieldOptions.values.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))
          : null}
      </DropDownInput>

      <FieldMsg msg={msg} />
    </div>
  );
};

export default DropdownField;
