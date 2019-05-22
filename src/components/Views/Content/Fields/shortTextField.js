import React, { useState, useEffect } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";

const ShortTextField = props => {
  const [content, setContent] = useState(props.value);
  const [isTyping, setIsTyping] = useState(false);
  const [editedTime, setEditedTime] = useState(0);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [charCount, setCharCount] = useState(props.value.length);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!isTyping && saved) {
      setMsg("Saved to draft");
      props.updateEditedTime(editedTime);
    }
  }, [isTyping, saved]);

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
      setEditedTime(req.editedAt);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);
    setIsTyping(true);
    setSaved(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setCharCount(newValue.length);
    setChangeCount(changeCount + 1);

    if (changeCount > 20) {
      setMsg("saving...");
      autoSave(newValue);
      setChangeCount(0);
    }

    if (newValue.length > 256) {
      setMsg(props.label + " too long!");
    } else {
      setMsg("saving...");
      props.drafting(true);
      setTypingTimeout(
        setTimeout(function() {
          setIsTyping(false);
          autoSave(newValue);
          setChangeCount(0);
          props.drafting(false);
        }, 700)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent(props.value);
    }
  }, [props.isDraftDiscarded]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <TextInput
        dataId={props.dataId}
        name={props.name}
        type="text"
        label={props.label}
        value={content}
        onChange={handleChange}
        required={false}
        autoComplete="off"
        disabled={props.disabled}
      />
      <span
        className="softtext"
        style={{ fontSize: "11pt", marginRight: "15px" }}
      >
        {charCount} / 256
      </span>
      <FieldMsg msg={msg} />
    </div>
  );
};

export default ShortTextField;
