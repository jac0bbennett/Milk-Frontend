import React, { useState, useEffect } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";

const LongTextField = props => {
  const [content, setContent] = useState(props.value);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [charCount, setCharCount] = useState(props.value.length);
  const [msg, setMsg] = useState("");

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
    } else {
      setMsg("Saved to draft");
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      props.updateEditedTime(req.editedAt);
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setCharCount(newValue.length);
    setChangeCount(changeCount + 1);

    if (changeCount > 20) {
      autoSave(newValue);
      setChangeCount(0);
    }

    if (newValue.length > 256) {
      setMsg(props.label + " too long!");
    } else {
      setMsg("saving...");
      setTypingTimeout(
        setTimeout(function() {
          autoSave(newValue);
          setChangeCount(0);
        }, 700)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <div style={{ marginBottom: "10px" }}>
      <textarea
        name={props.name}
        placeholder={props.label}
        value={content}
        onChange={handleChange}
        required={false}
      />
      <br />
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

export default LongTextField;
