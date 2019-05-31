import React, { useState, useEffect } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";

const NumberField = props => {
  const [content, setContent] = useState(props.value);
  const [typingTimeout, setTypingTimeout] = useState(0);
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

  const getNumValue = fieldVal => {
    if (props.fieldType === "number_int") {
      if (fieldVal === "") {
        return "";
      }
      if (Number.isInteger(parseFloat(fieldVal))) {
        return parseInt(fieldVal, 10);
      } else {
        setMsg("Value has to be integer!");
        return NaN;
      }
    } else if (props.fieldType === "number_float") {
      return parseFloat(fieldVal);
    } else {
      setMsg("Something went wrong!");
      return NaN;
    }
  };

  const handleChange = event => {
    const newValue = getNumValue(event.target.value);

    setContent(event.target.value);
    setSaved(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    if (Number.isNaN(newValue) && newValue !== "") {
      return null;
    } else if (newValue > Number.MAX_SAFE_INTEGER) {
      setMsg("Number is too big!");
    } else {
      setMsg("saving...");
      props.drafting(true);
      setTypingTimeout(
        setTimeout(function() {
          autoSave(newValue);
        }, 700)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent(props.value);
    }
  }, [props.isDraftDiscarded, props.value]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <TextInput
        dataId={props.dataId}
        name={props.name}
        type="number"
        label={props.label}
        value={content}
        onChange={handleChange}
        required={false}
        autoComplete="off"
        disabled={props.disabled}
      />
      <FieldMsg msg={msg} />
    </div>
  );
};

export default NumberField;
