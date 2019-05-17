import React, { useState } from "react";
import TextInput from "../../UI/Inputs/txtInput";

const ShortTextField = props => {
  const [content, setContent] = useState(props.value);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [charCount, setCharCount] = useState(props.value.length);
  const [msg, setMsg] = useState("");

  const handleChange = event => {
    setContent(event.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setCharCount(event.target.value.length);
    setChangeCount(changeCount + 1);

    if (changeCount > 20) {
      console.log("change limit");
      setChangeCount(0);
    }

    setTypingTimeout(
      setTimeout(function() {
        console.log("timeout");
        setChangeCount(0);
      }, 1000)
    );

    if (event.target.value.length > 256) {
      setMsg(props.label + " too long!");
    } else {
      setMsg("");
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <TextInput
        name={props.name}
        type="text"
        label={props.label}
        value={content}
        onChange={handleChange}
        required={false}
      />
      <span
        className="softtext"
        style={{ fontSize: "11pt", marginRight: "15px" }}
      >
        {charCount} / 256
      </span>
      <span style={{ fontSize: "11pt" }}>{msg}</span>
    </div>
  );
};

export default ShortTextField;
